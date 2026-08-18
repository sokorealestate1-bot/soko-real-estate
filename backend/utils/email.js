const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `https://soko-real-estate.vercel.app/verify-email/${token}`;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Verify Your Email - SOKO Real Estate",
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  await sgMail.send(msg);
};

const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `https://soko-real-estate.vercel.app/reset-password/${token}`;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Reset Your Password - SOKO Real Estate",
    html: `
      <p>Hi ${name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  await sgMail.send(msg);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
