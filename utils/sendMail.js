const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendMail = async ({ email, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "demsdems28@gmail.com",
      pass: `${process.env.GMAIL_PASS}`,
    },
  });

  const mailOptions = {
    to: email,
    from: "demsdems28@gmail.com",
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
  return null;
};
module.exports = sendMail;
