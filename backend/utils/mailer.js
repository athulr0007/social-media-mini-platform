import nodemailer from "nodemailer";

let transporter;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.BREVO_USER, // e.g. a382bc001@smtp-brevo.com
        pass: process.env.BREVO_PASS, // SMTP password
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return transporter;
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"Spark" <${process.env.BREVO_USER}>`,
      to: email,
      subject: "Your Verification Code - Spark",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="margin-bottom:10px">Verification Code</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Failed to send OTP");
  }
};

export default sendOTP;