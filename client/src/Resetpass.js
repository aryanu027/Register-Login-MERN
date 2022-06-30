import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
function Resetpass() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    otp: "",
  });
  const [btext, setbtext] = React.useState("Send OTP to my email");
  const [New, setNew] = React.useState("new");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const userUP = () => {
    setbtext("Verify OTP");
    // eslint-disable-next-line no-unused-vars
    const { email } = user;
    axios
      .post("http://localhost:3001/resetpass",user)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("OTP", JSON.stringify(res.data.otp));
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {btext === "Send OTP to my email" ? (
        <div>
          <Box
            sx={{
              width: 387,
              bgcolor: "background.paper",
              border: "8px solid #87CEEB",
              boxShadow: 24,
              textAlign: "center",
              margin: "auto",
              marginTop: 20,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h4"
              color="
            #2196f3"
              component="h1"
              style={{ marginTop: 15 }}
            >
              Enter your Email
            </Typography>
            <TextField
              style={{ width: 300, paddingTop: 30 }}
              id="outlined-password-input"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />

            <br></br>
            <div>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                size="large"
                onClick={userUP}
              >
                {btext}
              </Button>
            </div>
          </Box>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            color="black"
            component="h1"
            style={{ marginTop: 15 }}
          >
            Enter OTP
          </Typography>
          <TextField
            style={{ width: 150 }}
            name="otp"
            value={user.otp}
            onChange={handleChange}
          />
          <br></br>
          <Button
            style={{ margin: 20 }}
            variant="contained"
            size="large"
            onClick={() => {
              const rData = JSON.parse(localStorage.getItem("OTP"));
              console.log(rData);
              if (rData === user.otp) {
                navigate("/newpass");
              } else {
                alert("Invalid OTP");
              }
            }}
          >
            Verify OTP
          </Button>
          <br />
        </div>
      )}
    </>
  );
}

export default Resetpass;
