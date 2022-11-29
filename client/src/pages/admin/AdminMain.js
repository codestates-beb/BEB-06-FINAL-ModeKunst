import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "../../store/admin";
import Swal from "sweetalert2";

function AdminMain() {
  //🟠redux 관리자 정보
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;
  console.log();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LogoutHandler = () => {
    dispatch(adminLogout());
    Swal.fire({
      icon: "success",
      text: "로그아웃이 완료되었습니다.",
    });
    navigate("/");
    console.log(isAdmin);
  };

  if (!isAdmin) {
    navigate("/adminlogin");
    Swal.fire({
      icon: "warning",
      text: "관리자 로그인을 먼저 진행해주세요.",
    });
  } else
    return (
      <div className="h-screen space-y-5 items-center  flex flex-col ">
        <h1 className="mt-28 text-center font-title text-2xl">ADMIN PAGE</h1>
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
            <div className="font-content m-2 hover:font-bold">
              공지사항 및 래플
            </div>
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
        <div className="self-center w-4/5 bg-slate-100 rounded-md text-center space-y-2">
          <div className="font-title text-xl m-2">통계 현황</div>
          <div>금일 기준 인기 팔로워</div>
          <div>금일 기준 인기 게시물</div>
        </div>
      </div>
    );
}

export { AdminMain };
