import { useOutletContext } from "react-router-dom";
// import CardPost from "../components/common/CardPost";
import { useParams } from "react-router-dom";
import LikesList from "../components/common/Pagination/LikesList";

function UserHome() {
  const { nickname } = useParams();
  const { posts } = useOutletContext();

  return (
    <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
      <h1 className="text-2xl font-semibold"># {nickname} 님의 인기 게시물</h1>
      {posts ? <LikesList arr={posts} section="hotposts" /> : null}
    </div>
  );
}

export { UserHome };
