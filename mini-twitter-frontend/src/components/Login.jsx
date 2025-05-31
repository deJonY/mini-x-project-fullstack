import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import Navbar from "./Navbar";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3030/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Xato yuz berdi!");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-2">
          <Navbar />
        </div>
        <div className="col-xl-8 bg">
          <form onSubmit={handleSubmit}>
            <h1 className="text-white text-center text-uppercase">L o g i n</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              className="inp-username form-control text-white fw-medium"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="inp-parol form-control text-white fw-medium my-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="button btn btn-outline-light btn-lg fw-bold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
