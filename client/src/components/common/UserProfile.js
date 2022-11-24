import axios from "axios";
import Swal from "sweetalert2";
import { select } from "../../store/selectedSection";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

function cls(...classnames) {
  return classnames.join(" ");
}

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.user);

  const selectedSection = useSelector(
    state => state.selectedSection
  ).selectedSection;

  const nickname = useParams().nickname;
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
      .post(`http://localhost:8000/users/${nickname}/follow`)
      .then(result => {
        const data = result.data;
        setIsFollow(data.data.isFollow);
        alert(data.message);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const unfollowUser = () => {
    axios
      .post(`http://localhost:8000/users/${nickname}/unfollow`)
      .then(result => {
        const data = result.data;
        setIsFollow(data.isFollow);
        alert(data.message);
      });
  };

  return (
    <div className="select-none min-w-[900px]">
      <div className="mt-16 px-20 py-14 max-w-5xl mx-auto shadow-xl rounded-3xl">
        <div className="flex space-x-20">
          <div>
            <img
              alt="profile_image"
              src={user.profile_img}
              className="w-56 h-56 object-cover bg-slate-200 shadow-lg rounded-full"
            />
          </div>
          <div className="flex flex-col justify-evenly py-8 flex-1">
            <div className="space-y-4">
              <div className="text-3xl font-semibold">{user.nickname}</div>
              <div className="mt-1 flex space-x-2 text-xs">
                <div className="px-1 py-0.5 bg-blue-300 font-semibold rounded-full">
                  선크림사야돼
                </div>
                <div className="px-2 py-0.5 bg-pink-300 font-semibold rounded-full">
                  뿌링클
                </div>
                <div className="px-2 py-0.5 bg-slate-300 font-semibold rounded-full">
                  어나더레벨
                </div>
              </div>
            </div>
            <div>
              <div className="mt-8 flex space-x-1 text-xs">
                <span className="py-0.5 px-1 text-white bg-slate-700 rounded-full">
                  {user.height}cm
                </span>
                <span className="py-0.5 px-1 text-white bg-slate-700 rounded-full">
                  {user.weight}kg
                </span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-semibold px-1 py-0.5 bg-slate-300 rounded-full">
                  {followAmount}
                </span>
              </div>
            </div>
          </div>
          <div className="my-auto">
            {userInfo.userInfo.nickname === nickname ? null : isFollow ? (
              <button
                className="text-base font-semibold text-yellow-400 hover:text-violet-500 py-1 px-2 bg-violet-500 hover:bg-yellow-400 rounded-full shadow-md cursor-pointer"
                onClick={unfollowUser}
              >
                UNFOLLOW
              </button>
            ) : (
              <button
                className="text-base font-semibold text-yellow-400 hover:text-violet-500 py-1 px-2 bg-violet-500 hover:bg-yellow-400 rounded-full shadow-md cursor-pointer"
                onClick={followUser}
              >
                FOLLOW
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto space-x-1 flex">
        <Link
          to={`/user/${nickname}/hotposts`}
          // state={{ posts, nickname }}
          onClick={() => dispatch(select("hotposts"))}
          className={cls(
            "flex-1 text-base font-semibold text-center rounded-t-lg py-1",
            selectedSection === "hotposts"
              ? "bg-violet-400 text-yellow-400"
              : "bg-violet-200 text-yellow-200"
          )}
        >
          HOME
        </Link>
        <Link
          to={`/user/${nickname}/nfts`}
          onClick={() => dispatch(select("nfts"))}
          className={cls(
            "flex-1 text-base font-semibold text-center rounded-t-lg py-1",
            selectedSection === "nfts"
              ? "bg-violet-400 text-yellow-400"
              : "bg-violet-200 text-yellow-200"
          )}
        >
          NFT
        </Link>
        <Link
          to={`/user/${nickname}/collections`}
          state={{ collections, nickname }}
          onClick={() => dispatch(select("collections"))}
          className={cls(
            "flex-1 text-base font-semibold text-center rounded-t-lg py-1",
            selectedSection === "collections"
              ? "bg-violet-400 text-yellow-400"
              : "bg-violet-200 text-yellow-200"
          )}
        >
          COLLECTION
        </Link>
        <Link
          to={`/user/${nickname}/followings`}
          state={{ followings, nickname }}
          onClick={() => dispatch(select("followings"))}
          className={cls(
            "flex-1 text-base font-semibold text-center rounded-t-lg py-1",
            selectedSection === "followings"
              ? "bg-violet-400 text-yellow-400"
              : "bg-violet-200 text-yellow-200"
          )}
        >
          FOLLOWING
        </Link>
        <Link
          to={`/user/${nickname}/followers`}
          state={{ followers, nickname }}
          onClick={() => dispatch(select("followers"))}
          className={cls(
            "flex-1 text-base font-semibold text-center rounded-t-lg py-1",
            selectedSection === "followers"
              ? "bg-violet-400 text-yellow-400"
              : "bg-violet-200 text-yellow-200"
          )}
        >
          FOLLOWER
        </Link>
      </div>
      <Outlet context={{ nickname, posts, followings }} />
    </div>
  );
}
