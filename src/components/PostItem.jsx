import { useState, useEffect } from "react";
import axios from "axios";
import '../css/PostItem.css';

function PostItem({ post, onLike, onComment }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3030/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3030/posts/${post.id}/like`,
        {},
        { headers: { Authorization: token } }
      );
      onLike();
    } catch (err) {
      alert(err.response?.data || "Xato yuz berdi!");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3030/posts/${post.id}/comments`,
        { text: commentText },
        { headers: { Authorization: token } }
      );
      setCommentText("");
      fetchComments();
      onComment();
    } catch (err) {
      alert(err.response?.data || "Xato yuz berdi!");
    }
  };

  return (
    <div className="post-item">
      <p>
        <strong>{post.username}</strong> ({post.name})
      </p>
      <p>{post.text}</p>
      {post.image && <img src={`http://localhost:3030${post.image}`} alt="Post" width="200" />}
      <p>Likes: {post.like_count}</p>
      <button onClick={handleLike}>Like</button>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Kommentariya yozing..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
        <button type="submit">Yuborish</button>
      </form>
      <div className="comments">
        <h4>Kommentariyalar:</h4>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>
                <strong>{comment.username}</strong>: {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p>Hali kommentariya yo'q</p>
        )}
      </div>
    </div>
  );
}

export default PostItem;