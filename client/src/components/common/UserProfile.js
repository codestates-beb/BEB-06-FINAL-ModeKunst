import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import profile from "../../assets/profile.jpeg";
import {useSelector} from "react-redux";

function cls(...classnames) {
  return classnames.join(" ");
}

// 🗒 CHECK
// - data used: profile_img, nickname, height, weight, follower num.
// - FOLLOW 버튼 다르게 보여줘야 됨 (페이지 타고 들어간 유저가 해당 유저를 팔로우 하고 있는지 여부에 따라)
// - 4개의 링크가 있는데 각각 들어갈 때마다 데이터 받는게 나은 거 같은데 -> Link 타고 들어갈 때 데이터 전달 가능한지 확인

export default function UserProfile() {
  const userInfo = useSelector(state => state.user);

  const [selectedSection, setSelectedSection] = useState("");

  const nickname = useParams().nickname;

  const [user, setUsers] = useState('');
  const [followAmount, setFollowAmount] = useState('');
  const [posts, setPosts] = useState('');
  const [collections, setCollections] = useState('');
  const [followers, setFollowers] = useState('');
  const [followings, setFollowings] = useState('');
  const [isFollow, setIsFollow] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        // 👇🏻👇🏻 AXIOS 👇🏻👇🏻
        const result = await axios.get(
          `http://localhost:8000/users/mypage/${nickname}`
        );

        const { user, follow_amount, posts, followers, followings, likePosts, isFollow } = result.data.data;

        setUsers(user);
        setFollowAmount(follow_amount);
        setPosts(posts);
        setCollections(likePosts);
        setFollowers(followers);
        setFollowings(followings);
        setIsFollow(isFollow);
        setSelectedSection('');
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
    axios.post(`http://localhost:8000/users/${nickname}/follow`)
        .then((result) => {
            const data = result.data;
            setIsFollow(data.data.isFollow);
            alert(data.message);
        })
        .catch((e) => {
          console.log(e);
        })
  }

  const unfollowUser = () => {
    axios.post(`http://localhost:8000/users/${nickname}/unfollow`)
        .then((result) => {
          const data = result.data;
          setIsFollow(data.isFollow);
          alert(data.message);
        })
  }
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
                  {
                    followAmount
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="my-auto">
            {
              userInfo.userInfo.nickname === nickname
                ?
                  null
                :
                  isFollow
                      ?
                      <button className="text-base font-semibold text-yellow-400 hover:text-violet-500 py-1 px-2 bg-violet-500 hover:bg-yellow-400 rounded-full shadow-md cursor-pointer" onClick={unfollowUser}>
                        UNFOLLOW
                      </button>
                      :
                      <button className="text-base font-semibold text-yellow-400 hover:text-violet-500 py-1 px-2 bg-violet-500 hover:bg-yellow-400 rounded-full shadow-md cursor-pointer" onClick={followUser}>
                        FOLLOW
                      </button>


            }
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto space-x-1 flex">
        <Link
          to={`/user/${nickname}/hotposts`}
          // 데이터 전달
          state={{posts: posts, nickname: nickname}}
          onClick={() => setSelectedSection("hotposts")}
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
          // 데이터 전달
          // state={}
          onClick={() => setSelectedSection("nfts")}
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
          // 데이터 전달
          state={{collections: collections, nickname: nickname}}
          onClick={() => setSelectedSection("collections")}
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
          // 데이터 전달
          state={{followings: followings, nickname: nickname}}
          onClick={() => setSelectedSection("followings")}
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
          // 데이터 전달
          state={{followers: followers, nickname: nickname}}
          onClick={() => setSelectedSection("followers")}
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
      <Outlet />
    </div>
  );
}
