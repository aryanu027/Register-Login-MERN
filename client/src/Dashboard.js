import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigation = useNavigate();
  const rData = JSON.parse(localStorage.getItem("userData"));
  const Loguser = () => {
    localStorage.setItem("userData", "");
    navigation("/");
  };
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
          <Button variant="contained" size="large" onClick={Loguser}>
            Logout
          </Button>
        </h1>
      </div>
    </>
  );
};

export default Dashboard;
