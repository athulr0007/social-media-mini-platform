import nodemailer from "nodemailer";

let transporter;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendOTP = async (email, otp) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"Spark" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code - Spark",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Spark OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:24px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);">

          <!-- Top glow bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#667eea,#764ba2,#f093fb,#667eea);background-size:300% 100%;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:48px 40px 32px;">
              <!-- Logo circle -->
              <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:0 8px 32px rgba(102,126,234,0.4);">
                <span style="font-size:32px;color:#fff;font-weight:900;letter-spacing:-1px;">⚡</span>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">SPARK</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#8892b0;letter-spacing:2px;text-transform:uppercase;">Verification Code</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(102,126,234,0.3),transparent);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding:40px 40px 32px;">
              <p style="margin:0 0 12px;font-size:16px;color:#a8b2d8;line-height:1.6;">
                Use the code below to verify your identity.<br/>This code is valid for <strong style="color:#667eea;">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:0 40px 40px;">
              <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.25);border-radius:16px;padding:32px 40px;display:inline-block;width:100%;box-sizing:border-box;">
                
                <!-- OTP digits -->
                <div style="letter-spacing:20px;font-size:48px;font-weight:900;color:#ffffff;text-align:center;font-family:'Courier New',monospace;text-shadow:0 0 30px rgba(102,126,234,0.8),0 0 60px rgba(118,75,162,0.4);">
                  ${otp}
                </div>

                <!-- Subtle label -->
                <p style="margin:16px 0 0;font-size:12px;color:#4a5568;text-align:center;letter-spacing:3px;text-transform:uppercase;">One-Time Password</p>
              </div>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td align="center" style="padding:0 40px 32px;">
              <table cellpadding="0" cellspacing="0" style="background:rgba(240,93,251,0.06);border:1px solid rgba(240,93,251,0.15);border-radius:12px;width:100%;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#8892b0;line-height:1.6;text-align:center;">
                      🔒 &nbsp;Never share this code with anyone. Spark will <strong style="color:#f093fb;">never</strong> ask for your OTP via phone or chat.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(102,126,234,0.2),transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 40px 40px;">
              <p style="margin:0 0 8px;font-size:13px;color:#4a5568;line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#2d3748;">
                © ${new Date().getFullYear()} <span style="color:#667eea;font-weight:600;">Spark</span> · All rights reserved
              </p>
            </td>
          </tr>

          <!-- Bottom glow bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#667eea,#764ba2,#f093fb);opacity:0.5;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });

  console.log("OTP sent:", otp);
  return info;
};

export default sendOTP;