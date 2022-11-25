// collections(좋아요한 게시물)
// {id⭕️, image_1⭕️, title⭕️, content, category⭕️, views⭕️, createdAt, UserNickname⭕️}
import { Link } from "react-router-dom";

export default function CardPost({ post, section }) {
  return (
    <div className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer">
      {section === "mainPosts" ? (
        <Link to={`/post/${post.id}`}>
          <img
            alt="mainpost_image"
            src={post.image_1}
            className="object-contain rounded-lg shadow-xl block"
          />
        </Link>
      ) : (
        <Link to={`/post/${post.id}`}>
          <img
            alt="hotpost_image"
            src={post.image_1}
            className="object-contain rounded-lg shadow-xl block"
          />
        </Link>
      )}
      <div className="py-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg">
        <div className="px-2 flex justify-around items-center font-medium text-slate-200">
          <span className="text-sm">{post.title}</span>
          <div className="text-xs flex flex-col">
            {section === "hotposts" ? (
              <div>
                <span>{post.createdAt} </span>
                <div className="space-x-2">
                  <span>likes</span>
                  <span>views: {post.views}</span>
                </div>
              </div>
            ) : section === "mainPosts" ? (
              <div className="flex flex-col">
                <span>views: {post.views}</span>
                <span>{post.create_at}</span>
              </div>
            ) : (
              <div>
                <span>{post.UserNickname} </span>
                <div className="space-x-2">
                  <span>{post.category}</span>
                  <span>{post.views}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
