const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    let transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // Or 'SendGrid', 'Mailgun', etc. depending on provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log("No SMTP credentials found. Skipping email sending.");
      return;
    }

    const mailOptions = {
      from: '"ServiceHub" <noreply@servicehub.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    // If using Ethereal, log the preview URL to the console so we can view the test email
    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
