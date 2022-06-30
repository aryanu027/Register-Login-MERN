require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const BodyParser = require("body-parser");
app.use(cors());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const playerData = require("./Model");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ extended: true }));
//Google auth
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  const Decrypt = jwt.decode(tokens.id_token);
  res.json(Decrypt);
});
app.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // obtain new tokens
  res.json(credentials);
});
//JWT auth :)
app.post("/SignUp", async (req, res) => {
  const { email, password, confirmedPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await playerData.find({ email });
    if (existingUser.email === email) {
      return res.status(400).json({ message: "UAE" });
    }
    if (password !== confirmedPassword) {
      return res.status(400).json({ message: "PDM" });
    }
    const hashpassword = await bcrypt.hash(password, 12);
    //
    const newUser = await playerData.create({
      email,
      password: hashpassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test");
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      service: "outlook",
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD ,
      },
    });
    await transporter
      .sendMail({
        from: process.env.EMAIL, // sender address
        to: `${newUser.email}`, // list of receivers
        subject: "OTP for registeration", // Subject line
        text: "OTP for your registeration request", // plain text body
        html: `
        <h3>Your OTP is: </h3>
        <h1>${OTP}</h1>`, // html body
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    return res.status(201).json({
      otp: OTP,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.post("/resetpass", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    console.log(OTP);
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      service: "outlook",
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD ,
      },
    });
    await transporter
      .sendMail({
        from: "aryanumat123@outlook.com", // sender address
        to: `${email}`, // list of receivers
        subject: "OTP for registeration", // Subject line
        text: "OTP for your registeration request", // plain text body
        html: `
        <h3>Your OTP is: </h3>
        <h1>${OTP}</h1>`, // html body
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    return res.status(201).json({
      otp: OTP,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
app.patch("/update", async (req, res) => {
  try {
    const { password, confirmedPassword, email } = req.body;
    const existingUser = await playerData.findOne({ email });
    if (password === confirmedPassword) {
      existingUser.password = password;
    }
    res.status(200).json({ message: "OK"})
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
//
app.post("/SignIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await playerData.findOne({ email });
    if (existingUser.email !== email) {
      return res.status(404).json({ message: "user not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "password incorrect" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test"
    );
    res.status(200).json({
      email: existingUser.email,
      name: existingUser.name,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
//
const CONNECTION_URL =
  "mongodb+srv://aryan12:xdLYHHytVkGR9ghG@cluster0.vxbnxjf.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(3001, () => {
      console.log("listening on port 3001");
    });
  })
  .catch((err) => console.log(err));
