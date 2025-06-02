import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div>
      {/* <div className="d-flex align-items-center">
      </div> */}
      {token && <PostForm onPostCreated={() => window.location.reload()} />}
      <PostList url="http://localhost:3030/posts" />
    </div>
  );
}

export default Home;
