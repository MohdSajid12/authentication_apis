import nodemailer  from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Mohammad Sajid" <sajidsultan312@gmail.com>',
      to: email,
      subject: "Verify your Email",
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#f9f9f9;padding:20px;">
          
          <div style="background:#ffffff;padding:30px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
            
            <h2 style="color:#333;text-align:center;margin-bottom:20px;">
              Email Verification
            </h2>

            <p style="font-size:15px;color:#555;">
              Hi,
            </p>

            <p style="font-size:15px;color:#555;">
              Thank you for signing up. Please use the verification code below to verify your email address.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <span style="
                display:inline-block;
                font-size:26px;
                letter-spacing:6px;
                font-weight:bold;
                color:#ffffff;
                background:#4f46e5;
                padding:15px 30px;
                border-radius:6px;
              ">
                ${verificationCode}
              </span>
            </div>

            <p style="font-size:14px;color:#777;">
              This code will expire in <strong>10 minutes</strong>.
            </p>

            <p style="font-size:14px;color:#777;">
              If you did not request this, please ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

            <p style="font-size:13px;color:#999;text-align:center;">
              © ${new Date().getFullYear()} Mohammad Sajid. All rights reserved.
            </p>

          </div>
        </div>
      `,
    });

    // console.log("Email sent successfully", response);
  } catch (error) {
    console.log(error);
    throw error; 
  }
};
