import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendActivationCodeEmail } from '@/lib/mail';
import { logAuditAction } from '@/lib/audit';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let botToken = process.env.TELEGRAM_BOT_TOKEN;
    const { data: settings } = await supabaseAdmin
      .from('bot_settings')
      .select('bot_token, approver_telegram_id')
      .eq('id', 1)
      .maybeSingle();

    if (settings?.bot_token) {
      botToken = settings.bot_token;
    }

    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 200 });
    }

    const allowedChatId = settings?.approver_telegram_id || process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;
      const callbackQueryId = callbackQuery.id;
      const fromId = callbackQuery.from?.id?.toString();

      if (allowedChatId && fromId !== allowedChatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: '⚠️ Unauthorized: You are not allowed to approve or reject gift requests.',
            show_alert: true,
          }),
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 200 });
      }

      const isApprove = data.startsWith('approve_');
      const isReject = data.startsWith('reject_');

      if (isApprove || isReject) {
        const applicationId = data.split('_')[1];
        const status = isApprove ? 'approved' : 'rejected';

        let generatedCode = '';
        const updateData: any = {};
        if (isApprove) {
          generatedCode = `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          updateData.activation_code = generatedCode;
        } else {
          updateData.status = 'rejected';
          updateData.activation_code = null;
        }

        const { data: updateResult, error: updateError } = await supabaseAdmin
          .from('gift_applications')
          .update(updateData)
          .eq('id', applicationId)
          .select();

        if (updateError || !updateResult || updateResult.length === 0) {
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQueryId,
              text: '❌ Error: Failed to update status in the database.',
              show_alert: true,
            }),
          });

          return NextResponse.json({ error: 'Database update failed' }, { status: 200 });
        }

        const updatedApp = updateResult[0];

        let userEmail = 'Unknown User';
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(updatedApp.user_id);
          if (userData?.user) {
            userEmail = userData.user.email || 'Unknown User';
          }
        } catch {}

        let tariffName = 'Unknown Tariff';
        try {
          const { data: tariffData } = await supabaseAdmin
            .from('tariffs')
            .select('name')
            .eq('id', updatedApp.tariff_id)
            .maybeSingle();
          if (tariffData) {
            tariffName = tariffData.name;
          }
        } catch {}

        await logAuditAction('approval_action', 'success', {
          action: isApprove ? 'approve' : 'reject',
          application_id: applicationId,
          user_id: updatedApp.user_id,
          activation_code: generatedCode || undefined,
        });

        if (isApprove && userEmail !== 'Unknown User') {
          const emailResult = await sendActivationCodeEmail(userEmail, generatedCode, tariffName);
          if (emailResult.success) {
            await logAuditAction('email_attempt', 'success', {
              recipient: userEmail,
              activation_code: generatedCode,
              tariff_name: tariffName,
              application_id: applicationId,
            });
          } else {
            await logAuditAction('email_attempt', 'failed', {
              recipient: userEmail,
              activation_code: generatedCode,
              tariff_name: tariffName,
              application_id: applicationId,
              error: emailResult.error,
            });
          }
        }

        const statusText = isApprove ? '✅ Approved (Code Sent)' : '❌ Rejected';
        let updatedText = `🎁 *Gift Request*\n\nUser: \`${userEmail}\`\nRequested: *${tariffName}*\n\nStatus: ${statusText}`;
        if (isApprove && generatedCode) {
          updatedText += `\n🔑 Code: \`${generatedCode}\``;
        }

        await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: updatedText,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [] },
          }),
        });

        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: `Request successfully ${isApprove ? 'approved' : 'rejected'}.`,
          }),
        });
      }

      return NextResponse.json({ success: true });
    }

    if (body.message && body.message.text) {
      const message = body.message;
      const text = message.text.trim();
      const chatId = message.chat.id.toString();
      const fromId = message.from?.id?.toString();

      if (allowedChatId && fromId !== allowedChatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: '⚠️ Unauthorized: You are not allowed to interact with this bot.',
          }),
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 200 });
      }

      if (text === '/start') {
        const { data: existingSettings } = await supabaseAdmin
          .from('bot_settings')
          .select('id')
          .eq('id', 1)
          .maybeSingle();

        let upsertError;
        if (existingSettings) {
          const { error } = await supabaseAdmin
            .from('bot_settings')
            .update({ approver_telegram_id: chatId })
            .eq('id', 1);
          upsertError = error;
        } else {
          const { error } = await supabaseAdmin
            .from('bot_settings')
            .insert({ id: 1, approver_telegram_id: chatId });
          upsertError = error;
        }

        if (upsertError) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '❌ Failed to register you as the admin approver in the database. Please check server logs.',
            }),
          });
          return NextResponse.json({ error: 'Failed to save bot settings' }, { status: 200 });
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `👋 *Welcome back, Admin!*\n\nYou are successfully connected to the Gift App.\n\nYou will receive all gift application requests here.`,
            parse_mode: 'Markdown',
          }),
        });
      }
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: 'Update ignored' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 200 });
  }
}
