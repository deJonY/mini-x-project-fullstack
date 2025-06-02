import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3030/profile", {
          headers: { Authorization: token },
        });
        setUser(res.data);
      } catch (err) {
        alert(err.response?.data || "Xato yuz berdi!");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      <h1>Profil sahifasi</h1>
      <p><strong>Ism:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      {user.profile_picture && (
        <img src={`http://localhost:3030${user.profile_picture}`} alt="Profile" width="100" />
      )}
    </div>
  );
}

export default Profile;