import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
function App() {
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await axios
        .post("http://localhost:3001/auth/google", {
          code,
        })
        .then((res) => {
          if (res.data) {
            localStorage.setItem("userData", JSON.stringify(res.data));
            navigate("/Dashboard");
          }
        });
    },
    flow: "auth-code",
  });
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmedPassword: "",
    otp: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const [btext, setbtext] = React.useState("Send OTP to my email");
  const userUP = () => {
    // eslint-disable-next-line no-unused-vars
    const { email, password, firstName, lastName, confirmedPassword } = user;
    axios
      .post("http://localhost:3001/SignUp", user)
      .then((res) => {
        if (res.data) {
          setbtext("Verify OTP");
          localStorage.setItem("OTP", JSON.stringify(res.data.otp));
        }
      })
      .catch((err) => {
        if (err.response.data.message === "PDM") {
          alert("passwords don't match");
        } else if (err.response.data.message === "UAE") {
          alert("User alredy exixts");
        }
      });
  };
  return (
    <>
      <div>
        <Box
          sx={{
            width: 387,
            bgcolor: "background.paper",
            border: "8px solid #87CEEB",
            boxShadow: 24,
            textAlign: "center",
            margin: "auto",
            marginTop: 2,
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
            Register as new user
          </Typography>
          {btext === "Send OTP to my email" ? (
            <div>
              <TextField
                style={{ width: 300, paddingTop: 30 }}
                id="outlined-password-input"
                placeholder="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                autoFocus="autofocus"
              />
              <TextField
                style={{ width: 300, paddingTop: 30 }}
                id="outlined-password-input"
                placeholder="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
              <TextField
                style={{ width: 300, paddingTop: 30 }}
                id="outlined-password-input"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <TextField
                style={{ width: 300, paddingTop: 30 }}
                id="outlined-password-input"
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
              <TextField
                style={{ width: 300, paddingTop: 30 }}
                id="outlined-password-input"
                placeholder="Re-enter Password"
                name="confirmedPassword"
                value={user.confirmedPassword}
                onChange={handleChange}
              />
              <Button
                style={{ margin: 20 }}
                variant="contained"
                size="large"
                onClick={userUP}
              >
                {btext}
              </Button>
              <br />
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
                    navigate("/");
                  } else {
                    alert("Invalid OTP");
                  }
                }}
              >
                {btext}
              </Button>
              <br />
            </div>
          )}
          OR
          <br />
          <Button
            onClick={() => {
              googleLogin();
            }}
            style={{
              width: 300,
              height: 50,
              marginBottom: 15,
              marginTop: 15,
              backgroundColor: "linen",
              color: "gray",
            }}
            variant="contained"
          >
            Continue with Google
            <FcGoogle style={{ width: 30, height: 30 }} />
          </Button>
          {/* </div> */}
        </Box>
      </div>
    </>
  );
}

export default App;
