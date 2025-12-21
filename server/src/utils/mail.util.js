import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, otp) => {
  
  // 1. Create the transporter INSIDE the function.
  // This ensures 'process.env' is 100% loaded by the time this runs.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"PG Accommodation" <no-reply@pgapp.com>',
    to: email,
    subject: "Verify your Email - PG Accommodation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: " + info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};