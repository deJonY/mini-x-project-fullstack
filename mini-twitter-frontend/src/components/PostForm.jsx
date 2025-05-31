import { useState } from "react";
import axios from "axios";
import "../css/PostForm.css";

function PostForm({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3030/posts", formData, {
        headers: { Authorization: token },
      });
      setText("");
      setImage(null);
      onPostCreated();
    } catch (err) {
      alert(err.response?.data || "Xatolik yuz berdi!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New post</h3>
      <textarea
        className="commentSpace form-text bg-dark"
        placeholder="Fikringizni yozing..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      
      <input
        className="form-control w-75 bg-dark border-0 text-white my-2"
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" className="btn w-25 btn-dark">Yuborish</button>
    </form>
  );
}

export default PostForm;