import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css'

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {token ? (
        <>
        </>
      ) : (
        <>
      <button onClick={handleLogout}>Logout</button>
        </>
      )}
      <Link to="/signup">Signup</Link>
      <Link to="/login">Login</Link>
      <Link to="my-post">My Posts</Link>
      <Link to="/my-likes">My Likes</Link>
    </nav>
  );
}

export default Navbar;