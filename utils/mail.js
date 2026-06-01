const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_ID, // your Outlook email
    pass: process.env.MAIL_PASSWD, // your Outlook password or app password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// ✅ Check credentials without sending email
const checkCredentials = async () => {
  try {
    await transporter.verify();
    console.log("✅ Mail server is ready. Credentials are correct.");
  } catch (err) {
    console.error("❌ Mail server verification failed:", err);
  }
};

// checkCredentials();

const mailCode = async (email, code) => {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Verification",
    text: `Your code is ${code}.`,
  };
  let done;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      done = false;
    } else {
      done = true;
    }
  });
  return done;
};

module.exports = { mailCode };
