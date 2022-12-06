// 📍 mainPosts
// UserNickname / category / createdAt / id / image_1 / likes_num / reviews_num / title / views / profile_img

// 📍 hotPosts
// UserNickname / category / createdAt / id / image_1 / likes_num / reviews_num / title / views / content

// 📍 collections
// nickname / followings[] / posts[]
// posts -> UserNickname / category / createdAt / id / image_1 / likes_num / reviews_num / title / views / content

// 📍 followings
//

// 📍 followers
//

// 🗒 TODOS
// 1. UserHome/hotposts(인기게시물): 본인 게시물이니까 프로필이미지 & 이미지 안 보이는게 맞음

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import cls from "../../utils/setClassnames";

const parentVariant = {
  initial: { y: 0 },
  action: { y: -7, transition: { duration: 0.15 } },
};
const childVariant = {
  initial: { y: 0 },
  action: { y: -105 },
};

export default function PostCard({ post, section }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={parentVariant}
      initial="initial"
      whileHover="action"
      className="object-contain p-0.5 bg-black w-52 h-60 mx-auto relative overflow-hidden select-none cursor-pointer shadow-2xl rounded-md tablet:w-60 tablet:h-72 desktop:h-80"
    >
      <Link to={`/post/${post.id}`}>
        <img
          src={post.image_1}
          alt="post_image"
          className="aspect-square w-full h-full rounded-md"
        />
      </Link>

      <motion.div
        variants={childVariant}
        className="py-1.5 absolute left-0 right-0 -bottom-24 flex justify-around items-center text-slate-100 bg-black bg-opacity-50"
      >
        {/* profile_img & UserNickname */}
        {section === "hotposts" ? null : (
          <div className="flex flex-col items-center">
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={post.profile_img}
              alt="user_profile"
            />
            <span
              onClick={() => {
                navigate(`/user/${post.UserNickname}`);
              }}
              className="text-xs hover:scale-105"
            >
              {post.UserNickname}
            </span>
          </div>
        )}
        {/* category & title & views, likes_num, reviews_num */}
        {/* <div className="flex flex-col items-end"> */}
        <div
          className={cls(
            "flex flex-col",
            section === "hotposts" ? "items-center" : "items-end"
          )}
        >
          {/* category & title */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-1 bg-yellow-500 rounded-full text-center">
              {post.category}
            </span>
            <span className="text-semibold text-sm font-title">
              {post.title}
            </span>
          </div>
          {/* views & likes_num & reviews */}
          <div className="flex space-x-3">
            <div className="flex items-center text-xs">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-4 h-4 stroke-black fill-slate-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {post.views}
            </div>
            <div className="flex items-center text-xs">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                className="w-4 h-4 stroke-black fill-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              {post.likes_num}
            </div>
            <div className="flex items-center text-xs">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                className="w-4 h-4 stroke-black fill-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              {post.reviews_num}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
