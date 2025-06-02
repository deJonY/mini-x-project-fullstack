import PostList from "../components/PostList";

function MyLikes() {
  return (
    <div>
      <h1>Mening layklarim</h1>
      <PostList url="http://localhost:3030/my-likes" />
    </div>
  );
}

export default MyLikes;
