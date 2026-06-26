const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(email, name, otp) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@restro-saas.com",
    to: email,
    subject: "Reset Your Password - Restro SaaS OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #ea580c; text-align: center;">Restro SaaS OTP Verification</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Use the following verification code (OTP) to proceed. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border: 2px dashed #ea580c; padding: 10px 20px; border-radius: 4px;">
            ${otp}
          </span>
        </div>
        <p>If you did not make this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 Restro SaaS. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  transporter,
  sendOtpEmail,
};
