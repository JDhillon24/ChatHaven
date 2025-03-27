require("dotenv");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;
const path = require("path");

//initialize transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//configure handlebars for email templates
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve("./src/email/emailTemplates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/email/emailTemplates"),
    extName: ".hbs",
  })
);

const sendEmail = async (to, subject, template, context) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      template,
      context,
    };

    const mail = await transporter.sendMail(mailOptions);
    console.log(mail.response);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
