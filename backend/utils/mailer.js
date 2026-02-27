import axios from "axios";

const sendOTP = async (email, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Spark",
          email: process.env.BREVO_SENDER,
        },
        to: [
          {
            email,
          },
        ],
        subject: "Your Verification Code - Spark",
        htmlContent: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>Verification Code</h2>
            <p>Your OTP is:</p>
            <h1 style="letter-spacing:4px">${otp}</h1>
            <p>This code is valid for 10 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("EMAIL ERROR:", error.response?.data || error.message);
    throw new Error("Failed to send OTP");
  }
};

export default sendOTP;