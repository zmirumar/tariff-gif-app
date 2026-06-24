"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { logAuditAction } from "@/lib/audit";

export async function submitGiftApplication(tariffId: string, tariffName: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "You must be logged in to apply." };

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: pendingList, error: checkError } = await supabaseAdmin
      .from("gift_applications")
      .select("id, activation_code")
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (checkError) throw checkError;
    const activePending = pendingList?.filter(app => !app.activation_code) || [];
    if (activePending.length > 0) {
      return { success: false, message: "You already have a pending gift application. Please wait for admin approval." };
    }

    const { data: insertResult, error: dbError } = await supabaseAdmin
      .from("gift_applications")
      .insert({
        user_id: user.id,
        tariff_id: tariffId,
      })
      .select("id");

    if (dbError) {
      return { success: false, message: `DB Error: ${dbError.message} (Code: ${dbError.code})` };
    }

    if (!insertResult || insertResult.length === 0) {
      return { 
        success: false, 
        message: `DB Insert returned 0 rows. Row Level Security (RLS) or session role is blocking the SELECT action. User: ${user.email} (${user.id})` 
      };
    }

    const application = insertResult[0];

    let botToken = process.env.TELEGRAM_BOT_TOKEN;
    let adminChatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;

    const { data: settings } = await supabaseAdmin
      .from("bot_settings")
      .select("bot_token, approver_telegram_id")
      .eq("id", 1)
      .maybeSingle();

    if (settings) {
      if (settings.bot_token) {
        botToken = settings.bot_token;
      }
      if (settings.approver_telegram_id && !process.env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_ADMIN_CHAT_ID) {
        adminChatId = settings.approver_telegram_id;
      }
    }

    if (botToken && adminChatId) {
      const messageText = `🎁 *New Gift Request*\n\nUser: \`${user.email}\`\nRequested: *${tariffName}*\n\nDo you accept it?`;

      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: messageText,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Accept", callback_data: `approve_${application.id}` },
                  { text: "❌ Reject", callback_data: `reject_${application.id}` }
                ]
              ]
            }
          }),
        });

        if (response.ok) {
          await logAuditAction('telegram_notification', 'success', {
            recipient: adminChatId,
            message: messageText,
            application_id: application.id,
          });
        } else {
          const errText = await response.text();
          await logAuditAction('telegram_notification', 'failed', {
            recipient: adminChatId,
            message: messageText,
            application_id: application.id,
            error: errText,
          });
        }
      } catch (err: any) {
        await logAuditAction('telegram_notification', 'failed', {
          recipient: adminChatId,
          message: messageText,
          application_id: application.id,
          error: err.message || err,
        });
      }
    } else {
      await logAuditAction('telegram_notification', 'failed', {
        error: "Telegram configurations (bot token or admin chat ID) are missing. Notification skipped.",
        application_id: application.id,
      });
    }

    return { success: true, message: "Application submitted! Waiting for admin approval." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to submit application." };
  }
}

export async function buyTariffDirectly(tariffId: string, tariffName: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "You must be logged in to buy." };

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: insertResult, error: dbError } = await supabaseAdmin
      .from("gift_applications")
      .insert({
        user_id: user.id,
        tariff_id: tariffId,
        status: 'approved',
        activation_code: null,
      })
      .select("id");

    if (dbError) {
      return { success: false, message: `Purchase Error: ${dbError.message}` };
    }

    const application = insertResult?.[0];

    await logAuditAction('approval_action', 'success', {
      action: 'direct_purchase',
      application_id: application?.id,
      user_id: user.id,
    });

    return { 
      success: true, 
      message: `Tariff purchased successfully!` 
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to complete purchase." };
  }
}

export async function activateGiftWithCode(applicationId: string, code: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "You must be logged in to activate your gift." };

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: app, error: fetchError } = await supabaseAdmin
      .from("gift_applications")
      .select("user_id, status, activation_code")
      .eq("id", applicationId)
      .maybeSingle();

    if (fetchError || !app) {
      return { success: false, message: "Gift application not found." };
    }

    if (app.user_id !== user.id) {
      return { success: false, message: "You are not authorized to activate this gift." };
    }

    if (app.status !== "pending" || !app.activation_code) {
      return { success: false, message: "This application is not waiting for activation." };
    }

    if (app.activation_code.trim().toUpperCase() !== code.trim().toUpperCase()) {
      return { success: false, message: "Invalid activation code. Please check your email and try again." };
    }

    const { error: updateError } = await supabaseAdmin
      .from("gift_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);

    if (updateError) {
      return { success: false, message: `DB Update Error: ${updateError.message}` };
    }

    await logAuditAction("approval_action", "success", {
      action: "user_activation",
      application_id: applicationId,
      user_id: user.id,
      activation_code: code,
    });

    return { success: true, message: "Gift activated successfully! Enjoy your new tariff!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to activate gift." };
  }
}