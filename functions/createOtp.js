const mongoose = require("mongoose");
const express = require("express");
const sendOTP = require("../back/otp");
const crypto = require("crypto");

function randomOTP() {
  const keyword = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomKey = "";
  for (let i = 0; i < 6; i++)
    randomKey += keyword.charAt(Math.floor(Math.random() * keyword.length));

  return randomKey;
}

async function hash(key) {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(key, salt, 16, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}
const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://antardas:antardas@cluster0.mc60i.mongodb.net/qualyvalAuth"
  );
};
exports.handler = async (event, context) => {
  try {
    await connectDB();
    const { email } = event.queryStringParameters;
    const key = randomOTP();
    const hashedKey = await hash(key);
    const messageId = await sendOTP(email, key);
    console.log(messageId);                                                                                                                                                                                                                                                          
    if (messageId && hashedKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Please Check Your Email",
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: "Please try aging" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 404,
      body: JSON.stringify(err),
    };
  }
};
// return {
//       statusCode: 200,
//       body: "err.response",
//     };
