import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Resetpass from "./Resetpass";
import Newpass from "./Newpass";
import * as React from "react";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Resetpass" element={<Resetpass />} />
          <Route path="Newpass" element={<Newpass />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
