// collections(좋아요한 게시물)
// {id⭕️, image_1⭕️, title⭕️, content, category⭕️, views⭕️, createdAt, UserNickname⭕️}
import { Link } from "react-router-dom";

export default function CardPostTwo({ post, section }) {
  return (
    <div className="mt-2 relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer">
      {section === "searchResults" ? (
        <Link to={`/post/${post.id}`}>
          <img
            alt="post_image"
            src={post.image_1}
            className="object-contain h-full w-full rounded-lg shadow-xl block border-2 border-black"
          />
        </Link>
      ) : (
        ""
      )}

      <div className="py-1 absolute h-10 bottom-0 left-0 right-0 bg-black rounded-b-lg">
        <div className="px-2 flex justify-around items-center font-medium text-slate-200">
          <span className="text-sm">{post.title}</span>
          <div className="text-xs flex flex-col">
            {section === "searchResults" ? (
              <div>
                <span>{post.UserNickname} </span>
                <span>views: {post.views}</span>
                <span>likes</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
