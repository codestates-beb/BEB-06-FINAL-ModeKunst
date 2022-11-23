// 🟠 followings
// {Following, profile_img, follow_amount}
// -> Following하는 닉네임, 그 사람의 프로필, 그 사람의 팔로워 수
// 🟠 followers
// {Follower, profile_img, follow_amount}
import { Link } from "react-router-dom";

export default function FollowCard({ user, section }) {
  console.log(user);
  return (
    <div className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer">
      <Link to={`/user/${user.Following}`}>
        <img
          alt="user_image"
          src={user.profile_img}
          className="object-contain rounded-lg shadow-xl block"
        />
      </Link>
      <div className="text-xs text-white font-semibold px-4 py-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg flex justify-between">
        {section === "followers" ? (
          <span>{user.Follower}</span>
        ) : (
          <span>{user.Following}</span>
        )}
        <span className="text-xs">follower {user.follow_amount}</span>
      </div>
    </div>
    // <div className="flex flex-col items-center space-y-2">
    //   <div className="w-48 h-48 bg-slate-500 rounded-full shadow-md">
    //     <Link to={`/user/${user.Following}`}>
    //       <img src={user.profile_img} alt="user_profile_img" />
    //     </Link>
    //   </div>
    //
    //   <div className="flex flex-col">
    //     <span>{user.Following}</span>
    //     <span className="text-xs">팔로워 수: {user.follow_amount}</span>

    //   </div>
    // </div>
  );
}
