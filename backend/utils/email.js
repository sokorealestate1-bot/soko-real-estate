const sgMail = require('@sendgrid/mail');

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===== Send Verification Email =====
const sendVerificationEmail = async (email, name, token) => {
  try {
    const verificationUrl = `https://soko-real-estate.vercel.app/verify-email/${token}`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Verify Your Email - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Welcome ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for registering with SOKO Real Estate. Please verify your email address to start using your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">If you didn't create an account with SOKO Real Estate, you can ignore this email.</p>
          <p style="font-size: 14px; color: #666;">This link expires in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Verification email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Verification):', error.response?.body || error.message);
    // Return error but don't throw – registration should still succeed
    return { success: false, error: error.response?.body || error.message };
  }
};

// ===== Send Password Reset Email =====
const sendPasswordResetEmail = async (email, name, token) => {
  try {
    const resetUrl = `https://soko-real-estate.vercel.app/reset-password/${token}`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Reset Your Password - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Password Reset</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">If you didn't request this, you can ignore this email.</p>
          <p style="font-size: 14px; color: #666;">This link expires in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Password reset email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Password Reset):', error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
};

// ===== Send Property Approved Email =====
const sendPropertyApprovedEmail = async (email, name, propertyTitle) => {
  try {
    const propertyUrl = `https://soko-real-estate.vercel.app/property/`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "✅ Your Property Has Been Approved - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Great news! Your property <strong>"${propertyTitle}"</strong> has been approved and is now live on SOKO Real Estate.</p>
          <p style="font-size: 16px; line-height: 1.6;">Buyers can now view your property on our platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${propertyUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Your Property
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Thank you for choosing SOKO Real Estate.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Property approved email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Property Approved):', error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
};

// ===== Send Property Rejected Email =====
const sendPropertyRejectedEmail = async (email, name, propertyTitle) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "❌ Property Update - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.6;">We wanted to let you know that your property <strong>"${propertyTitle}"</strong> has been reviewed and is currently not approved for listing.</p>
          <p style="font-size: 16px; line-height: 1.6;">If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_FROM}">${process.env.EMAIL_FROM}</a>.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Property rejected email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Property Rejected):', error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
};

// ===== Send Property Featured Email =====
const sendPropertyFeaturedEmail = async (email, name, propertyTitle) => {
  try {
    const propertyUrl = `https://soko-real-estate.vercel.app/property/`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "⭐ Your Property is Now Featured - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Exciting news! Your property <strong>"${propertyTitle}"</strong> has been featured on SOKO Real Estate.</p>
          <p style="font-size: 16px; line-height: 1.6;">Featured properties get prime placement on our homepage and search results, giving you more visibility.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${propertyUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Your Property
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Property featured email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Property Featured):', error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
};

// ===== Send Property Verified Email =====
const sendPropertyVerifiedEmail = async (email, name, propertyTitle) => {
  try {
    const propertyUrl = `https://soko-real-estate.vercel.app/property/`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "✅ Your Property Has Been Verified - SOKO Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">SOKO Real Estate</h1>
          <h2 style="text-align: center;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Great news! Your property <strong>"${propertyTitle}"</strong> has been verified by the SOKO Real Estate team.</p>
          <p style="font-size: 16px; line-height: 1.6;">The "Verified by SOKO" badge adds trust and credibility to your listing, helping buyers feel confident.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${propertyUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Your Property
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Property verified email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error (Property Verified):', error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPropertyApprovedEmail,
  sendPropertyRejectedEmail,
  sendPropertyFeaturedEmail,
  sendPropertyVerifiedEmail,
};