import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    password: "",
    confirmedPassword: "",
    email:"aryanumat99@gmail.com"
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const userUP = () => {
    // eslint-disable-next-line no-unused-vars
    const { password, confirmedPassword,email } = user;
    axios
      .patch("http://localhost:3001/update", user)
      .then((res) => {
        if (res.data) {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.data.message === "PDM") {
          alert("passwords don't match");
        } else {
          console.log(err);
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
            Reset Password
          </Typography>
          <div>
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
              Reset Password
            </Button>
            <br />
          </div>
        </Box>
      </div>
    </>
  );
}

export default App;
