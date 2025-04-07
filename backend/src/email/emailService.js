require("dotenv").config();
const nodemailer = require("nodemailer");
const { create } = require("express-handlebars");
const fs = require("fs");
const path = require("path");

//create handlebars instance
const hbs = create({
  extname: ".hbs",
  layoutsDir: "",
  partialsDir: path.join(__dirname, "./emailTemplates"),
});

//compile email template
const compileTemplate = async (templateName, context) => {
  const filePath = path.join(
    __dirname,
    "./emailTemplates",
    `${templateName}.hbs`
  );
  const source = fs.readFileSync(filePath, "utf8");
  const template = hbs.handlebars.compile(source);

  return template(context);
};

//initialize transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//configure handlebars for email templates
// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       extname: ".hbs",
//       partialsDir: path.resolve("./src/email/emailTemplates"),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve("./src/email/emailTemplates"),
//     extName: ".hbs",
//   })
// );

const sendEmail = async (to, subject, template, context) => {
  try {
    const html = await compileTemplate(template, context);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const mail = await transporter.sendMail(mailOptions);
    console.log(mail.response);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
