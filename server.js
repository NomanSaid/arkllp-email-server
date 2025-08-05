require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  origin: ["https://arkllp.pk"], // ✅ Live origin only
  methods: ["POST"],
  credentials: true
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(err => {
  if (err) {
    console.error("❌ SMTP verification failed:", err);
    process.exit(1);
  }
  console.log("✅ SMTP server verified and ready");
});

app.post("/send-email", async (req, res) => {
  console.log("Received form submission:", req.body);
  
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const mailOptions = {
    from: '"Contact Form" <nomansaid778890@gmail.com>',
    replyTo: email,
    to: "nomansaid778890@gmail.com",
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 30px;">
          <h2 style="color: #333333;">📬 New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #4f46e5; border-radius: 4px; color: #333;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">Sent from your website contact form.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
    return res.json({ success: true });
  } catch (error) {
    console.error("🔥 Email send error:", error);
    return res.status(500).json({ success: false, error: `SMTP Error: ${error.message}` });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
