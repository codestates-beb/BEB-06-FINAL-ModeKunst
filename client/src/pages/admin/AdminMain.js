import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "../../store/admin";

import axios from "axios";
import ReactApexChart from "react-apexcharts";
import Swal from "sweetalert2";

function AdminMain() {
  //🟠redux 관리자 정보
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //🟠통계 상태관리
  const [userNum, setUserNum] = useState(0);
  const [userRatio, setUserRatio] = useState({});
  const [mostFollowers, setMostFollwers] = useState([]);
  const [mostLikes, setMostLikes] = useState([]);
  const [mostReviews, setMostReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/data", {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.data;
        console.log(data);
        setUserNum(data.people_amount);
        setUserRatio(data.people_ratio);
        setMostFollwers(data.popular_people.follower_rank_arr);
        setMostLikes(data.popular_post.likes_rank_arr);
        setMostReviews(data.reviews_rank_post.reviews_rank_arr);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  //도넛 차트 데이터 및 옵션
  const donutData = {
    series: [66.4, 33.6],
    options: {
      chart: {
        width: 500,
        type: "pie",
      },
      labels: ["여성", "남성"],
    },
  };

  const LogoutHandler = () => {
    dispatch(adminLogout());
    Swal.fire({
      icon: "success",
      text: "로그아웃이 완료되었습니다.",
    });
    navigate("/");
    console.log(isAdmin);
  };

  const getToday = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
  };

  if (!isAdmin) {
    navigate("/adminlogin");
    Swal.fire({
      icon: "warning",
      text: "관리자 로그인을 먼저 진행해주세요.",
    });
  } else
    return (
      <div className="h-full space-y-5 items-center  flex flex-col ">
        <h1 className="mt-28 text-center font-title text-3xl">ADMIN PAGE</h1>
        <div className="font-content text-center">
          {adminInfo.nickname}님,안녕하세요.
          <div className="mt-2">
            <button
              onClick={LogoutHandler}
              className="font-content text-xs px-2 py-1 bg-black rounded-full text-white self-center"
            >
              로그아웃
            </button>
          </div>
        </div>
        <div className="self-center w-4/5 bg-slate-100 rounded-md grid grid-cols-2 text-center">
          <div className="hover:bg-slate-200">
            <Link to="/admin/banner">
              <div className="font-content m-2 hover:font-bold">
                배너 이벤트 관리
              </div>
            </Link>
          </div>
          <div className="hover:bg-slate-200">
            <Link to="/admin/writenotice">
              <div className="font-content m-2 hover:font-bold">
                공지사항 및 래플
              </div>
            </Link>
          </div>
          <Link to="/admin/report">
            <div className="hover:bg-slate-200">
              <button className="font-content m-2 hover:font-bold">
                신고 관리
              </button>
            </div>
          </Link>
          <div className="hover:bg-slate-200">
            <button className="font-content m-2 hover:font-bold">
              NFT 관리
            </button>
          </div>
        </div>
        <div className="self-center w-4/5 bg-slate-100 rounded-md text-center space-y-4 px-4 py-4">
          <div className="font-title text-2xl m-2">통계 현황</div>
          <div className="text-xs font-content text-end m-4 text-slate-600">
            기준일: {getToday()}
          </div>
          <div className="bg-white drop-shadow-md rounded-md space-y-1">
            <div className="py-4 font-bold text-lg">사용자 통계</div>
            <div className="flex flex-col">
              <div>
                <div className="font-bold">총 가입자 수</div>
                <div className="text-2xl text-yellow-500">{userNum}명</div>
              </div>
              <div>
                <div className="mt-4 font-bold">가입자 성비</div>
                <ReactApexChart
                  options={donutData.options}
                  series={donutData.series}
                  type="donut"
                  width="300"
                />
              </div>
            </div>
          </div>
          <div className="bg-white drop-shadow-md rounded-md space-y-4 p-4">
            <div className="font-bold text-lg px-4 py-4">포스트 통계</div>
            <div className="flex flex-col bg-slate-300 rounded-md py-2 px-10">
              <div className="font-bold my-2">최대 팔로워 보유 유저</div>
              {mostFollowers.map((el, i) => (
                <div className="font-start flex flex-row space-x-">
                  <div className="font-semibold">{i + 1}.</div>
                  <Link to={`/user/${el.nickname}`}>
                    <div className="ml-1 font-semibold">{el.nickname}</div>
                  </Link>
                  <div className="ml-3 text-sm font-medium text-blue-900">
                    팔로워 총 {el.followers_num}명
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col bg-slate-300 rounded-md py-2 px-10">
              <div className="font-bold my-2">최다 좋아요 보유 게시물</div>
              {mostLikes.map((el, i) => (
                <div className="font-start flex flex-row space-x-">
                  <div className="font-semibold">{i + 1}.</div>
                  <Link to={`/post/${el.id}`}>
                    <div className="ml-1 font-semibold">{el.title}</div>
                  </Link>
                  {/* <div className="ml-1">{el.UserNickname}</div> */}
                  <div className="ml-3 text-sm font-medium text-blue-900">
                    좋아요 총 {el.likes_num}개
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col bg-slate-300 rounded-md py-2 px-10">
              <div className="font-bold my-2">최다 댓글 보유 게시물</div>
              {mostReviews.map((el, i) => (
                <div className="font-start flex flex-row space-x-">
                  <div className="font-semibold">{i + 1}.</div>
                  <Link to={`/post/${el.id}`}>
                    <div className="ml-1 font-semibold">{el.title}</div>
                  </Link>
                  {/* <div className="ml-1">{el.UserNickname}</div> */}
                  <div className="ml-3 text-sm font-medium text-blue-900">
                    리뷰 총 {el.reviews_num}개
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-48" />
      </div>
    );
}

export { AdminMain };
