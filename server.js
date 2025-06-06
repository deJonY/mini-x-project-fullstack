import express from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

console.log(process.env.DB_USER);

pool
  .connect()
  .then(() => console.log("PostgreSQL ulandi!"))
  .catch((err) => console.error("PostgreSQL xatosi:", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[0];

  if (!token) {
    return res.status(401).send("Token topilmadi!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Token noto'g'ri!");
    }
    req.user = user;
    next();
  });
}

app.get("/test", (req, res) => {
  res.send("Mini Twitter Backend ishlayapti!");
});

app.post("/signup", upload.single("profile_picture"), async (req, res) => {
  const { name, username, password } = req.body;
  const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, username, profile_picture, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, username, profile_picture, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("Signup xatosi:", err.message);
    res.status(500).send(err.message || "Server xatosi!");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).send("Foydalanuvchi topilmadi!");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).send("Parol noto'g'ri!");
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await pool.query(
      "SELECT id, name, username, profile_picture FROM users WHERE id = $1",
      [user_id]
    );
    if (user.rows.length === 0) {
      return res.status(404).send("Foydalanuvchi topilmadi!");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.post("/posts", authenticateToken, upload.single("image"), async (req, res) => {
  const { text } = req.body;
  const user_id = req.user.id;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, text, image) VALUES ($1, $2, $3) RETURNING *",
      [user_id, text, image]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT posts.*, users.username, users.name, 
       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.get("/my-posts", authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const posts = await pool.query(
      `SELECT posts.*, users.username, users.name, 
       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [user_id]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.post("/posts/:id/like", authenticateToken, async (req, res) => {
  const post_id = req.params.id;
  const user_id = req.user.id;

  try {
    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [user_id, post_id]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [user_id, post_id]
      );
      res.send("Like o'chirildi");
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *",
        [user_id, post_id]
      );
      res.send("Like qo'yildi");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.get("/my-likes", authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const posts = await pool.query(
      `SELECT posts.*, users.username, users.name, 
       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       JOIN likes ON posts.id = likes.post_id
       WHERE likes.user_id = $1
       ORDER BY posts.created_at DESC`,
      [user_id]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.post("/posts/:id/comments", authenticateToken, async (req, res) => {
  const post_id = req.params.id;
  const user_id = req.user.id;
  const { text } = req.body;

  try {
    const newComment = await pool.query(
      "INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3) RETURNING *",
      [user_id, post_id, text]
    );
    res.json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  const post_id = req.params.id;

  try {
    const comments = await pool.query(
      `SELECT comments.*, users.username, users.name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at DESC`,
      [post_id]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi!");
  }
});

app.use(express.static(path.join(__dirname, 'mini-twitter-frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'mini-twitter-frontend/dist/index.html'));
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti: http://localhost:${PORT}`);
});