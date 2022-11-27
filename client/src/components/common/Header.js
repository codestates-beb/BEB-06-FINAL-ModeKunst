import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/user";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cls from "../../utils/setClassnames";
import SearchBar from "./SearchBar";
import Swal from "sweetalert2";
import logo from "../../assets/modekunst.png";
import axios from "axios";

const tokenVariants = {
  initial: { opacity: 0, y: -3, transition: { duration: 0.15 } },
  visible: { opacity: 1, y: 3, transition: { duration: 0.15 } },
  invisible: { opacity: 0, y: -3, transition: { duration: 0.15 } },
};

export default function Header() {
  // loggedInUserInfo = 로그인된 유저 정보 & isLoggedIn = 유저의 로그인 여부(불리언)
  const { userInfo: loggedInUserInfo, isLoggedIn } = useSelector(
    state => state.user
  );
  const [isToggleMenu, setIsToggleMenu] = useState(false);
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({});
  const [isTokenBtnClicked, setIsTokenBtnClicked] = useState(false);
  const searchModalRef = useRef();
  const menuRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClickOutside = ({ target }) => {
    if (isSearchModal && !searchModalRef.current.contains(target))
      setIsSearchModal(false);
  };

  const toggleMenu = () => {
    setIsToggleMenu(prevState => !prevState);
  };

  const tokenInfoHandler = async () => {
    try {
      if (!isTokenBtnClicked) {
        const result = await axios.get(
          `http://localhost:8000/users/tokens/${loggedInUserInfo.nickname}`
        );
        const {
          data: { data },
        } = result;
        setTokenInfo(data);
        console.log("hi");
      }
      setIsTokenBtnClicked(prevState => !prevState);
    } catch (error) {
      console.log(error.toString());
    }
  };

  const logoutHandler = () => {
    Swal.fire({
      icon: "question",
      text: "정말로 로그아웃 하시겠어요?",
      confirmButtonText: "네",
      showDenyButton: true,
      denyButtonText: "아니오",
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          text: "로그아웃 되었습니다",
        });
        toggleMenu();
        dispatch(logout());
        navigate("/");
      }
    });
  };

  return (
    // lg: prefix -> lg 크기 이후 부터 적용될 스타일
    <nav className="fixed top-0 left-0 right-0 px-10 py-20 flex flex-col justify-center items-center select-none shadow-md bg-white lg:flex-row lg:py-12 lg:space-x-10">
      <header>
        <Link to="/">
          <img alt="logo" src={logo} className="max-w-xs" />
        </Link>
        {/* 햄버거 메뉴 */}
        <motion.button
          whileHover={{ rotateZ: 180, transition: { duration: 0.26 } }}
          onClick={toggleMenu}
          className="p-1 absolute top-20 right-8 lg:hidden"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </motion.button>
      </header>
      <div
        ref={menuRef}
        className={cls(
          "mt-10 space-y-4 lg:flex lg:flex-col lg:grow lg:px-12",
          isToggleMenu ? "flex flex-col" : "hidden"
        )}
      >
        {/* 메뉴 이동 네비게이션(홈, 글작성, 마이페이지, 채팅, 검색 순) */}
        <ul className="flex flex-col justify-between space-y-6 text-center text-base font-title font-bold lg:flex-row lg:space-y-0">
          <li
            onClick={toggleMenu}
            className="px-3 hover:scale-110 cursor-pointer"
          >
            <Link to="/">HOME</Link>
          </li>
          <li
            onClick={toggleMenu}
            className="px-3 hover:scale-110 cursor-pointer"
          >
            <Link to="/write">WRITE</Link>
          </li>
          <li
            onClick={toggleMenu}
            className="px-3 hover:scale-110 cursor-pointer"
          >
            <Link to={`/user/${loggedInUserInfo.nickname}`}>MYPAGE</Link>
          </li>
          <li
            onClick={toggleMenu}
            className="px-3 hover:scale-110 cursor-pointer"
          >
            <Link>CHAT</Link>
          </li>
          <li
            onClick={toggleMenu}
            className="px-3 hover:scale-110 cursor-pointer"
          >
            <button onClick={() => setIsSearchModal(true)}>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </li>
        </ul>
        {/* 로그인 & 회원가입 */}
        {isLoggedIn ? (
          <div className="self-end flex items-center space-x-4 text-xs text-white">
            <div className="relative">
              <button onClick={tokenInfoHandler} className="hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  className="w-4 h-4 stroke-black fill-yellow-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {isTokenBtnClicked ? (
                  <motion.div
                    variants={tokenVariants}
                    initial="initial"
                    animate="visible"
                    exit="invisible"
                    className="flex flex-col items-center absolute -bottom-16 -left-4 text-black font-medium bg-slate-100 px-4 pt-3 pb-3 shadow-md rounded-lg before:content-[''] before:absolute before:w-3 before:h-3 before:-top-1 before:left-5 before:rotate-45 before:bg-slate-100"
                  >
                    <button
                      onClick={() => setIsTokenBtnClicked(false)}
                      className="absolute top-2 right-1.5 hover:scale-110"
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <span className="text-yellow-500 font-bold">
                      {tokenInfo.token_amount} {tokenInfo.token_symbol}{" "}
                      <span className="text-black font-medium">보유 중</span>
                    </span>
                    <span className="text-indigo-600 font-semibold">
                      {tokenInfo.address}
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <span className="self-end text-xs text-black font-medium">
              <Link
                to={`/user/${loggedInUserInfo.nickname}`}
                className="text-indigo-800 text-sm font-semibold"
              >
                {loggedInUserInfo.nickname}
              </Link>{" "}
              님, Ready to Change?
            </span>
            <button
              onClick={logoutHandler}
              className="px-2 py-0.5 rounded-full hover:scale-105 bg-black"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="self-end space-x-8 text-xs text-white">
            <button
              onClick={toggleMenu}
              className="px-2 py-0.5  rounded-full hover:scale-105 bg-black"
            >
              <Link to="/signup">회원가입</Link>
            </button>
            <button
              onClick={toggleMenu}
              className="px-2 py-0.5 rounded-full hover:scale-105 bg-black"
            >
              <Link to="/login">로그인</Link>
            </button>
          </div>
        )}
      </div>

      {isSearchModal && (
        <SearchBar ref={searchModalRef} closeModal={setIsSearchModal} />
      )}
    </nav>
  );
}
