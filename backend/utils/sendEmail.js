const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {  // ✅ FIXED here
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `TechNest ❤️ <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

module.exports = sendEmail;
