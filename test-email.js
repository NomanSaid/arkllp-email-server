// test-email.js
const nodemailer = require("nodemailer");

async function run() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nomansaid778890@gmail.com",
      pass: "jbgjggmtyjldqomj"
    }
  });

  transporter.verify((err, success) => {
    if (err) {
      console.error("Verify failed:", err);
    } else {
      console.log("SMTP verified, ready to send");
    }
  });

  try {
    let info = await transporter.sendMail({
      from: '"Test" <nomansaid778890@gmail.com>',
      to: "nomansaid778890@gmail.com",
      subject: "Test Email",
      text: "Hello — this is a test"
    });
    console.log("Test email sent:", info);
  } catch (err) {
    console.error("Test email error:", err);
  }
}

run();
