import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import profile from "../../assets/profile.jpeg";

function cls(...classnames) {
  return classnames.join(" ");
}

// 🗒 CHECK
// - data used: profile_img, nickname, height, weight, follower num.
// - FOLLOW 버튼 다르게 보여줘야 됨 (페이지 타고 들어간 유저가 해당 유저를 팔로우 하고 있는지 여부에 따라)
// - 4개의 링크가 있는데 각각 들어갈 때마다 데이터 받는게 나은 거 같은데 -> Link 타고 들어갈 때 데이터 전달 가능한지 확인

export default function UserProfile({ nickname }) {
  const [selectedSection, setSelectedSection] = useState("hotposts");

  useEffect(() => {
    async function fetchData() {
      try {
        // 👇🏻👇🏻 AXIOS 👇🏻👇🏻
        // const result = await axios.get(
        //   `http://localhost:3000/users/mypage/${nickname}`
        // );
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "잠시 후에 다시 시도해주세요.",
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="select-none min-w-[900px]">
      <div className="mt-16 px-20 py-14 max-w-5xl mx-auto shadow-xl rounded-3xl">
        <div className="flex space-x-20">
          <div>
            <img
              alt="profile_image"
              src={profile}
              className="w-56 h-56 object-cover bg-slate-200 shadow-lg rounded-full"
            />
          </div>
          <div className="flex flex-col justify-evenly py-8 flex-1">
            <div className="space-y-4">
              <div className="text-3xl font-semibold">Jason Kim</div>
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
                  184cm
                </span>
                <span className="py-0.5 px-1 text-white bg-slate-700 rounded-full">
                  83kg
                </span>
              </div>
              <div className="mt-1">
                <span className="text-xs font-semibold px-1 py-0.5 bg-slate-300 rounded-full">
                  12.3k
                </span>
              </div>
            </div>
          </div>
          <div className="my-auto">
            <button className="text-base font-semibold text-yellow-400 hover:text-violet-500 py-1 px-2 bg-violet-500 hover:bg-yellow-400 rounded-full shadow-md cursor-pointer">
              FOLLOW
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto space-x-1 flex">
        <Link
          to={`/user/${nickname}/hotposts`}
          // 데이터 전달
          // state={}
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
          // state={}
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
          // state={}
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
          // state={}
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
