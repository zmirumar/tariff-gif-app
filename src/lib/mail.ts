import nodemailer from 'nodemailer';

export async function sendActivationCodeEmail(
  toEmail: string,
  activationCode: string,
  tariffName: string
): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'noreply@tariffgiftportal.com';

  if (!user || !pass) {
    return { success: false, error: 'SMTP credentials not configured (SMTP_USER or SMTP_PASS missing)' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from,
      to: toEmail,
      subject: `🎁 Your Activation Code for ${tariffName}`,
      text: `Hello,\n\nYour gift request for the tariff "${tariffName}" has been approved!\n\nHere is your activation code:\n\n${activationCode}\n\nThank you for using our service!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #52c41a; text-align: center;">🎁 Gift Request Approved!</h2>
          <p>Hello,</p>
          <p>We are pleased to inform you that your gift request for the tariff <strong>${tariffName}</strong> has been approved!</p>
          <div style="background-color: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 14px; color: #595959; display: block; margin-bottom: 5px;">YOUR ACTIVATION CODE</span>
            <strong style="font-size: 24px; color: #389e0d; letter-spacing: 2px;">${activationCode}</strong>
          </div>
          <p>Thank you for using our service!</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #8c8c8c; text-align: center;">This is an automated notification. Please do not reply to this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'SMTP sending failed' };
  }
}
