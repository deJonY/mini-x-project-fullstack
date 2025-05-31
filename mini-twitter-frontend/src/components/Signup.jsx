import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";
import Navbar from "./Navbar";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      await axios.post("http://localhost:3030/signup", formData);
      alert("Ro'yxatdan o'tdingiz! Endi tizimga kiring.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Xato yuz berdi!");
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
            <h2 className="text-white text-center text-uppercase">S i g n u p</h2>
            <input
              className="form-control inp-name text-white"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="form-control inp-username my-3 text-white"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="form-control inp-parol text-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="form-control bg-black text-white my-3 text-white"
              type="file"
              placeholder="Profile Picture"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            <button type="submit" className="button">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
