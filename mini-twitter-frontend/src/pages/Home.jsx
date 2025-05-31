import Navbar from "../components/Navbar";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-2">
          <Navbar />
        </div>
        <div className="col-xl-7">
          <PostList url="http://localhost:3030/posts" />
        </div>
        <div className="col-xl-3">
          <div className="position-fixed">
            {token && <PostForm onPostCreated={() => window.location.reload()} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
