import { useState } from "react";
import axios from "axios";

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
      onPostCreated(); // Postlar ro'yxatini yangilash uchun
    } catch (err) {
      alert(err.response?.data || "Xato yuz berdi!");
    }
  };

  return (
    <form className="post" onSubmit={handleSubmit}>
      <h3>Yangi post</h3>
      <textarea
        placeholder="Fikringizni yozing..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Yuborish</button>
    </form>
  );
}

export default PostForm;