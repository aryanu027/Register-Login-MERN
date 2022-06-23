require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const BodyParser = require("body-parser");
const Razorpay = require("razorpay");
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
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
// ///  /// / / // / //
app.post("/payment/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
// app.post("/payment/success", async (req, res) => {
//   try {
//     // getting the details back from our font-end
//     const {
//       orderCreationId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//     } = req.body;

//     // Creating our own digest
//     // The format should be like this:
//     // const digest = hmac_sha256(
//     //   orderCreationId + "|" + razorpayPaymentId,
//     //   "test"
//     // );
//     // generated_signature = hmac_sha256(
//     //   orderCreationId + "|" + razorpayPaymentId,
//     //   process.env.CLIENT_SECRET
//     // );
//     const shasum = crypto.createHmac("sha256", process.env.CLIENT_ID);
//     shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
//     const digest = shasum.digest("hex");
//     // comaparing our digest with the actual signature
//     if (digest !== razorpaySignature)
//       return res.status(400).json({ msg: "Transaction not legit!" });
//     // THE PAYMENT IS LEGIT & VERIFIED
//     // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
//     res.json({
//       msg: "success",
//       orderId: razorpayOrderId,
//       paymentId: razorpayPaymentId,
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
// Google Auth
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
