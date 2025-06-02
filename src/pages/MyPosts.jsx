import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyPosts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div>
      <h1>Mening postlarim</h1>
      <PostList url="http://localhost:3030/my-posts" />
    </div>
  );
}

export default MyPosts;