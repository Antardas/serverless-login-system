const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
connectDB();
const port = process.env.PORT || 5000;
const crypto = require("crypto");
const sendOTP = require("./otp");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
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

async function verify(password, hash) {
  console.log(password, hash);
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 16, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}

// Model

const otpModel = mongoose.model("otpModel", {
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Email"],
  },
  OTP: {
    type: String,
    required: [true, "Please Enter Your Email"],
  },
});

app.get("/", (req, res) => {
  res.send("You are doing well");
});
app.get("/createOtp/:email", async (req, res) => {
  try {
    console.log(req.params.email);
    const key = randomOTP();
    const hashedKey = await hash(key);
    const messageId = await sendOTP(req.params.email, key);
    if (messageId && hashedKey) {
      res.status(200).json({success: true, message: "Please Check you Email"}).cookie("hashedKey", hashedKey, {
        expires: new Date(Date.now() + (1000 * 60 * 5))
        httpOnly: true,
      });
    } else {
      res.status(404).json({ success: false, message: "Try again" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/validateOTP/:OTP/:email", async (req, res) => {
  // console.log(req.headers.cookie, 'vairfdfjd');
  const validOTP = await otpModel.findOne({ email: req.params.email });
  console.log(req.params);
  if (!validOTP) {
    return res
      .status(200)
      .json({
        success: false,
        message: "Email not found, Try again",
        validOTP,
      });
  }
  const data = await verify(req.params.OTP, validOTP?.OTP);
  console.log(data);
  if (!data) {
    return res
      .status(200)
      .json({ success: false, message: "OTP  didn't Matched" });
  }
  await otpModel.deleteOne({ _id: data._id });
  res.status(200).json({ success: true, message: "OTP Matched Successfully" });
});

app.listen(port, () => console.log("listening on port", port));
