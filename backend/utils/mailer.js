import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "Spark <onboarding@resend.dev>",
    to: email,
    subject: "Your Verification Code - Spark",
    html: `<p>Your OTP is <strong>${otp}</strong>. Valid for 10 minutes.</p>`,
  });

  if (error) throw new Error(error.message);
  return data;
};

export default sendOTP;