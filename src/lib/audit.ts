import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function logAuditAction(
  actionType: 'telegram_notification' | 'email_attempt' | 'approval_action',
  status: 'success' | 'failed',
  details: any
) {
  try {
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        action_type: actionType,
        status,
        details,
      });
  } catch {}
}
