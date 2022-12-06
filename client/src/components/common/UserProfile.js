import axios from "axios";
import Swal from "sweetalert2";
import { select } from "../../store/selectedSection";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import cls from "../../utils/setClassnames";

const userProfileVar = {
  enter: { opacity: 0 },
  visible: { opacity: 1 },
  invisible: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export default function UserProfile() {
  const { userInfo: loggedInUser, isLoggedIn } = useSelector(
    state => state.user
  );
  const screenMode = useSelector(
    state => state.currentScreenMode
  ).currentScreenMode;
  const selectedSection = useSelector(
    state => state.selectedSection
  ).selectedSection;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickname } = useParams();
  const [user, setUsers] = useState("");
  const [followAmount, setFollowAmount] = useState("");
  const [posts, setPosts] = useState("");
  const [collections, setCollections] = useState("");
  const [followers, setFollowers] = useState("");
  const [followings, setFollowings] = useState("");
  const [isFollow, setIsFollow] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(
          `http://localhost:8000/users/mypage/${nickname}`,
          { withCredentials: true }
        );
        const {
          user,
          follow_amount,
          posts,
          followers,
          followings,
          likePosts,
          isFollow,
        } = result.data.data;
        dispatch(select("hotposts"));
        navigate(`/user/${nickname}`);
        setUsers(user);
        setFollowAmount(follow_amount);
        setPosts(posts);
        setCollections(likePosts);
        setFollowers(followers);
        setFollowings(followings);
        setIsFollow(isFollow);
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "잠시 후에 다시 시도해주세요.",
        });
      }
    }
    fetchData();
  }, [nickname]);

  const followUser = () => {
    axios
      .post(`http://localhost:8000/users/${nickname}/follow`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data;
        setIsFollow(data.data.isFollow);
        Swal.fire({
          icon: "success",
          text: data.message,
        });
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: error.response.data.message,
        });
      });
  };
  const unfollowUser = () => {
    axios
      .post(`http://localhost:8000/users/${nickname}/unfollow`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data;
        setIsFollow(data.isFollow);
        Swal.fire({
          icon: "success",
          text: data.message,
        });
      });
  };

  return (
    <motion.div
      variants={userProfileVar}
      initial="enter"
      animate="visible"
      exit="invisible"
      className="w-full mx-auto max-w-[1400px] px-5 space-y-16 flex flex-col items-center my-40 tablet:px-16 tablet:my-64 select-none"
    >
      <div
        className={cls(
          "grid grid-cols-1 gap-5 place-items-center w-full px-10 py-10 space-y-5 bg-slate-800 rounded-lg border-[3px] border-black desktop:w-4/5",
          loggedInUser.nickname === nickname
            ? "tablet:grid-cols-2"
            : "tablet:grid-cols-3"
        )}
      >
        {/* 1) 이미지 */}
        <div className="w-40 h-40 border-2 border-black rounded-full desktop:w-72 desktop:h-72">
          <img
            alt="profile_image"
            src={user.profile_img}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {/* 2) 정보 뭉치 */}
        <div
          className={cls(
            "h-full flex flex-col justify-evenly items-center space-y-2 flex-1 tablet:items-start",
            screenMode !== "mobile" && loggedInUser.nickname === nickname
              ? "place-self-start"
              : "place-self-center"
          )}
        >
          {/* 2-1) 닉네임, 채팅, 설정 */}
          <div className="flex items-center space-x-1 tablet:space-x-2 desktop:space-x-3">
            <span className="text-2xl text-slate-50 font-title font-semibold tablet:text-4xl tablet:font-bold desktop:text-5xl">
              {nickname}
            </span>
            {loggedInUser.nickname === nickname ? (
              <button className="px-0.5 py-0.5 bg-orange-500 rounded-full">
                <Link to="/reset/myinfo">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 stroke-slate-50"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>
              </button>
            ) : (
              <button className="p-1 bg-blue-500 hover:bg-blue-600 rounded-full shadow-md">
                <Link to={"/chat"} state={nickname}>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    className="w-4 h-4 tablet:w-4 tablet:h-4 stroke-slate-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                </Link>
              </button>
            )}
          </div>
          <div className="space-y-2">
            {/* 2-2) NFT & 키, 몸무게, 팔로워 수 */}
            <div className="flex space-x-2 text-xs font-semibold">
              <div className="px-2 py-0.5 bg-yellow-300 font-semibold rounded-full">
                NFT A
              </div>
              <div className="px-2 py-0.5 bg-yellow-300 font-semibold rounded-full">
                NFT B
              </div>
              <div className="px-2 py-0.5 bg-yellow-300 font-semibold rounded-full">
                NFT C
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="flex space-x-1 text-xs text-white">
                <span className="px-2 py-0.5 bg-slate-800 rounded-full">
                  W {user.weight}
                </span>
                <span className="px-2 py-0.5 bg-slate-800 rounded-full">
                  H {user.height}
                </span>
                <div className="px-2 py-0.5 text-xs font-semibold bg-violet-700 text-yellow-300 rounded-full self-end">
                  <span>팔로워 {followAmount > 0 ? followAmount : 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 3) 팔로우 버튼 */}
        <>
          {loggedInUser.nickname === nickname ? null : isFollow ? (
            <button
              className="py-1 px-2 text-sm font-semibold text-slate-50 hover:text-orange-400 bg-orange-400 hover:bg-slate-50 rounded-lg shadow-md cursor-pointer"
              onClick={unfollowUser}
            >
              UNFOLLOW
            </button>
          ) : (
            <button
              className="py-1 px-2 text-sm font-semibold text-slate-50 hover:text-green-500 bg-green-500 hover:bg-slate-50 rounded-lg shadow-md cursor-pointer"
              onClick={followUser}
            >
              FOLLOW
            </button>
          )}
        </>
      </div>

      <div className="w-full">
        <div className="w-full flex justify-between space-x-1">
          <Link
            to={`/user/${nickname}/hotposts`}
            onClick={() => dispatch(select("hotposts"))}
            className={cls(
              "flex-1 text-base font-semibold flex justify-center rounded-t-lg py-1",
              selectedSection === "hotposts"
                ? "bg-slate-900 text-yellow-400"
                : "bg-slate-500 text-yellow-200"
            )}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
              />
            </svg>
          </Link>
          <Link
            to={`/user/${nickname}/nfts`}
            onClick={() => dispatch(select("nfts"))}
            className={cls(
              "flex-1 text-base font-semibold flex justify-center rounded-t-lg py-1",
              selectedSection === "nfts"
                ? "bg-slate-900 fill-yellow-400"
                : "bg-slate-500 fill-yellow-200"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="w-5 h-5"
            >
              <path d="M21.1 33.9c12.7-4.6 26.9-.7 35.5 9.6L320 359.6V64c0-17.7 14.3-32 32-32s32 14.3 32 32V448c0 13.5-8.4 25.5-21.1 30.1s-26.9 .7-35.5-9.6L64 152.4V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 50.5 8.4 38.5 21.1 33.9z" />
            </svg>
          </Link>
          <Link
            to={`/user/${nickname}/collections`}
            state={{ collections, nickname }}
            onClick={() => dispatch(select("collections"))}
            className={cls(
              "flex-1 text-base font-semibold flex justify-center rounded-t-lg py-1",
              selectedSection === "collections"
                ? "bg-slate-900 text-yellow-400"
                : "bg-slate-500 text-yellow-200"
            )}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </Link>
          <Link
            to={`/user/${nickname}/followings`}
            state={{ followings, nickname }}
            onClick={() => dispatch(select("followings"))}
            className={cls(
              "flex-1 text-sm font-semibold text-center rounded-t-lg py-1",
              selectedSection === "followings"
                ? "bg-slate-900 text-yellow-400"
                : "bg-slate-500 text-yellow-200"
            )}
          >
            팔로잉
          </Link>
          <Link
            to={`/user/${nickname}/followers`}
            state={{ followers, nickname }}
            onClick={() => dispatch(select("followers"))}
            className={cls(
              "flex-1 text-sm font-semibold text-center rounded-t-lg py-1",
              selectedSection === "followers"
                ? "bg-slate-900 text-yellow-400"
                : "bg-slate-500 text-yellow-200"
            )}
          >
            팔로워
          </Link>
        </div>
        <Outlet context={{ nickname, posts, followings }} />
      </div>
    </motion.div>
  );
}
