"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendActivationCodeEmail } from "@/lib/mail";
import { logAuditAction } from "@/lib/audit";

const getSupabaseAdmin = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveTelegramBotToken(token: string, origin: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "You must be logged in as an administrator." };

    const cleanedToken = token.trim();
    if (!cleanedToken) {
      return { success: false, message: "Bot token cannot be empty." };
    }

    const { data: existing } = await supabase
      .from("bot_settings")
      .select("id")
      .eq("id", 1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("bot_settings")
        .update({ bot_token: cleanedToken })
        .eq("id", 1);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("bot_settings")
        .insert({ id: 1, bot_token: cleanedToken });
      if (error) throw error;
    }

    const webhookUrl = `${origin}/api/telegram`;
    const tgUrl = `https://api.telegram.org/bot${cleanedToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    
    const response = await fetch(tgUrl);
    const tgResult = await response.json();

    if (!response.ok || !tgResult.ok) {
      return { 
        success: true, 
        message: `Token saved, but registering webhook failed: ${tgResult.description || "Unknown error"}. (Note: Localhost/HTTP urls are not accepted by Telegram. Use ngrok or deploy to register the webhook URL).` 
      };
    }

    return { 
      success: true, 
      message: "Telegram Bot Token saved and webhook registered successfully!" 
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function adminApproveRejectGiftApplication(applicationId: string, status: 'approved' | 'rejected') {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "You must be logged in as an administrator." };

    const isApprove = status === 'approved';
    let generatedCode = '';
    const updateData: any = {};
    
    if (isApprove) {
      generatedCode = `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      updateData.activation_code = generatedCode;
    } else {
      updateData.status = 'rejected';
      updateData.activation_code = null;
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: updateResult, error: updateError } = await supabaseAdmin
      .from('gift_applications')
      .update(updateData)
      .eq('id', applicationId)
      .select();

    if (updateError) throw updateError;
    if (!updateResult || updateResult.length === 0) {
      return { success: false, message: "Gift application not found." };
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
      by_admin_panel: true,
    });

    if (isApprove && userEmail !== 'Unknown User') {
      const emailResult = await sendActivationCodeEmail(userEmail, generatedCode, tariffName);
      if (emailResult.success) {
        await logAuditAction('email_attempt', 'success', {
          recipient: userEmail,
          activation_code: generatedCode,
          tariff_name: tariffName,
          application_id: applicationId,
          by_admin_panel: true,
        });
      } else {
        await logAuditAction('email_attempt', 'failed', {
          recipient: userEmail,
          activation_code: generatedCode,
          tariff_name: tariffName,
          application_id: applicationId,
          error: emailResult.error,
          by_admin_panel: true,
        });
      }
    }

    return { 
      success: true, 
      message: `Gift application successfully ${status === 'approved' ? 'approved' : 'rejected'}.` 
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function getAdminGiftApplications() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized", data: [] };

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('gift_applications')
      .select('*, tariffs(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const resolvedData = await Promise.all((data || []).map(async (item: any) => {
      let email = 'Unknown User';
      try {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(item.user_id);
        if (userData?.user) {
          email = userData.user.email || 'Unknown User';
        }
      } catch {}

      return {
        id: item.id,
        user_id: item.user_id,
        email,
        tariff_id: item.tariff_id,
        tariff_name: item.tariffs?.name || 'Unknown Tariff',
        price: Number(item.tariffs?.price || 0),
        duration_months: item.tariffs?.duration_months || 0,
        status: (item.status === 'pending' && item.activation_code) ? 'code_sent' : item.status,
        activation_code: item.activation_code || '',
        created_at: new Date(item.created_at).toLocaleString(),
      };
    }));

    return { success: true, data: resolvedData };
  } catch (err: any) {
    return { success: false, message: err.message, data: [] };
  }
}
