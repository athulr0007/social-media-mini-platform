import nodemailer from "nodemailer";

let transporter;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });
  }
  return transporter;
};

const sendOTP = async (email, otp) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"Spark" <${process.env.BREVO_USER}>`,
    to: email,
    subject: "Your Verification Code - Spark",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Verification Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `,
  });

  return info;
};

export default sendOTP;