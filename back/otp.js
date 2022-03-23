"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendOTP(email, otp) {
  console.log({ email, otp });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "deyapurba4444@gmail.com",
      pass: "nmnmnbnlhvncqcbi",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Qualyval Auth" <${process.env.MAIL_USER}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "no-reply", // Subject line
    html: `<h4> your OTP is ${otp} </h4> <div style="color: red"> note: this OTP is only valid for 5 Minutes </div>`, // html body
  });
  return info.messageId;
}

module.exports = sendOTP;
