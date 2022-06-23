import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
require("dotenv").config();
const Dashboard = () => {
  const navigation = useNavigate();
  const rData = JSON.parse(localStorage.getItem("userData"));
  const Loguser = () => {
    localStorage.setItem("userData", "");
    navigation("/");
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  async function razorpayD() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axios.post("http://localhost:3001/payment/orders");

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Aryan Corpotation",
      description: "Upgrade to premium plan",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(
          "http://localhost:3001/payment/success",
          data
        );

        alert(result.data.msg);
      },
      notes: {
        address: "Aryan Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <>
      <div
        style={{
          fontSize: 45,
        }}
      >
        <h1 className="dh1" style={{ textAlign: "center" }}>
          Welcome <span style={{ color: "#2196f3" }}>{rData.name}</span>
          <br />
          <Button
            variant="contained"
            color="success"
            style={{ width: 600, height: 80, fontSize: 30 }}
            onClick={razorpayD}
          >
            Upgrade to premium now
          </Button>
          <br />
          <Button variant="contained" size="large" onClick={Loguser}>
            Logout
          </Button>
        </h1>
      </div>
    </>
  );
};

export default Dashboard;
