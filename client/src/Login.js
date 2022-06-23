import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
function Login() {
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
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const userUP = () => {
    // eslint-disable-next-line no-unused-vars
    const { email, password } = user;
    axios
      .post("http://localhost:3001/SignIn", user)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("userData", JSON.stringify(res.data));
          navigate("/Dashboard");
        }
      })
      .catch((err) => console.log(err));
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
            marginTop: 20,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h2"
            color="
            #2196f3"
            component="h1"
            style={{ marginTop: 15 }}
          >
            Login
            <p style={{ fontSize: 15 }}>
              Register as
              <Link to="Register" style={{ fontSize: 15, marginLeft: 5 }}>
                New User
              </Link>
            </p>
          </Typography>
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
          <br></br>
          <div>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              size="large"
              onClick={userUP}
            >
              Login
            </Button>
            <br />
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
              Sign in with Google
              <FcGoogle style={{ width: 30, height: 30 }} />
            </Button>
          </div>
        </Box>
      </div>
    </>
  );
}

export default Login;