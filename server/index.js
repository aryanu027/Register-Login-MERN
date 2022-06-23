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
const playerData = require("./Model");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("HELO");
});
//Google auth
const oAuth2Client = new OAuth2Client(
  (process.env.CLIENT_ID =
    "811917741144-gj3ubj3due8bakrpn03f05m7njrouh6r.apps.googleusercontent.com"),
  (process.env.CLIENT_SECRET = "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"),
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
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmedPassword) {
      return res.status(400).json({ message: "Passwords dont match" });
    }
    const hashpassword = await bcrypt.hash(password, 12);
    //
    const newUser = await playerData.create({
      email,
      password: hashpassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test");
    return res.status(201).json({
      message: "OK",
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});
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
