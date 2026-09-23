const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(email, name, otp) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER.includes("your_smtp")) {
    console.log(`[SMTP Notice] OTP email to ${email} skipped because SMTP_USER is not configured yet.`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Restro SaaS" <noreply@restro-saas.com>',
    to: email,
    subject: "Reset Your Password - Restro SaaS OTP Verification",
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #ea580c; text-align: center; font-weight: 800;">Restro SaaS OTP Verification</h2>
        <p style="color: #334155; font-size: 15px;">Hello ${name},</p>
        <p style="color: #334155; font-size: 15px;">You requested to reset your password. Use the following verification code (OTP) to proceed. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a; border: 2px dashed #ea580c; padding: 10px 24px; border-radius: 8px; background-color: #fff7ed;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you did not make this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 Restro SaaS Platform. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendWelcomeRegistrationEmail(email, name, restaurantName) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER.includes("your_smtp")) {
    console.log(`[SMTP Notice] Welcome email to ${email} skipped because SMTP_USER is not configured yet.`);
    return;
  }

  const loginUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000") + "/login";

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Restro SaaS" <noreply@restrosaas.com>',
    to: email,
    subject: `🎉 Welcome to Restro SaaS - ${restaurantName} Account Activated!`,
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #ea580c, #f97316); padding: 12px 20px; border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 20px;">
            Restro SaaS
          </div>
        </div>
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-bottom: 12px; text-align: center;">
          🎉 You are Registered & Live!
        </h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Congratulations! Your restaurant account for <strong>${restaurantName}</strong> has been successfully registered and activated on the Restro SaaS platform.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h4 style="color: #0f172a; margin: 0 0 8px 0; font-size: 14px;">⚡ Account Details:</h4>
          <p style="margin: 4px 0; color: #475569; font-size: 13px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0; color: #475569; font-size: 13px;"><strong>Restaurant Name:</strong> ${restaurantName}</p>
          <p style="margin: 4px 0; color: #475569; font-size: 13px;"><strong>Status:</strong> Active (14-Day Free Trial)</p>
        </div>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          You can now sign in to your Admin Console to configure table QR codes, kitchen KDS screens, and digital menu items.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: linear-gradient(135deg, #ea580c, #f97316); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block;">
            Sign In to Admin Console &rarr;
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 Restro SaaS Platform. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  transporter,
  sendOtpEmail,
  sendWelcomeRegistrationEmail,
};
