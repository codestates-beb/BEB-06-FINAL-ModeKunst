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

  const toggleMenuHandler = () => {
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
      Swal.fire({
        icon: "error",
        text: "토큰 및 마일리지 정보를 불러올 수 없습니다.",
      });
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
        toggleMenuHandler();
        dispatch(logout(nickname));
        navigate("/");
      }
    });
  };

  return (
    <nav className="z-10 fixed top-0 left-0 right-0 py-8 flex flex-col justify-center items-center select-none shadow-md bg-white tablet:py-14 desktop:flex-row desktop:justify-between desktop:items-start desktop:py-0 desktop:pt-12 desktop:pb-4">
      <header className="w-1/3 tablet:w-3/8 desktop:w-3/7">
        <Link to="/">
          <img alt="logo" src={logo} className="w-full mx-auto desktop:w-3/5" />
        </Link>
        {/* 햄버거 메뉴 */}
        <motion.button
          whileHover={{ rotateZ: 180, transition: { duration: 0.26 } }}
          onClick={toggleMenuHandler}
          className="absolute top-8 left-8 tablet:top-14 desktop:hidden"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 tablet:w-6 tablet:h-6"
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
          "mt-8 space-y-4 desktop:mt-0 desktop:grow desktop:flex desktop:flex-col desktop:pr-12",
          isToggleMenu ? "flex flex-col" : "hidden"
        )}
      >
        <ul className="flex flex-col justify-between space-y-3 text-center text-sm font-title font-semibold desktop:flex-row desktop:space-y-0">
          <li
            onClick={toggleMenuHandler}
            className="px-1.5 hover:scale-110 cursor-pointer"
          >
            <Link to="/">HOME</Link>
          </li>
          <li
            onClick={toggleMenuHandler}
            className="px-1.5 hover:scale-110 cursor-pointer"
          >
            <Link to="/write">WRITE</Link>
          </li>
          <li
            onClick={toggleMenuHandler}
            className="px-1.5 hover:scale-110 cursor-pointer"
          >
            <Link to={`/user/${loggedInUserInfo.nickname}`}>MYPAGE</Link>
          </li>
          <li
            onClick={toggleMenuHandler}
            className="px-1.5 hover:scale-110 cursor-pointer"
          >
            <Link>CHAT</Link>
          </li>
          <li
            onClick={toggleMenuHandler}
            className="px-1.5 hover:scale-110 cursor-pointer"
          >
            <button onClick={() => setIsSearchModal(true)}>
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </li>
        </ul>
        {/* 로그인 & 회원가입 */}
        {isLoggedIn ? (
          <div className="self-end flex flex-col items-center space-y-2 text-xs text-white desktop:items-end">
            <button
              onClick={logoutHandler}
              className="px-2 py-0.5 rounded-full hover:scale-105 bg-black"
            >
              로그아웃
            </button>
            <div className="relative flex items-center space-x-2">
              <span
                onClick={toggleMenuHandler}
                className="self-end text-xs text-black font-medium"
              >
                <Link
                  to={`/user/${loggedInUserInfo.nickname}`}
                  className="text-indigo-800 text-sm font-semibold"
                >
                  {loggedInUserInfo.nickname}
                </Link>{" "}
                님, Ready to Change?
              </span>
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
                    className="flex flex-col items-center absolute -left-20 -bottom-16 text-black text-xs font-medium bg-slate-100 px-4 pt-3 pb-3 shadow-md rounded-lg before:content-[''] before:absolute before:w-3 before:h-3 before:-top-1 before:right-24 before:rotate-45 before:bg-slate-100 desktop:-left-40 desktop:before:right-4"
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
                    <span className="text-yellow-500 text-sm font-bold">
                      {tokenInfo.token_amount} {tokenInfo.token_symbol}{" "}
                      <span className="text-black text-xs font-medium">
                        보유 중
                      </span>
                    </span>
                    <span className="text-indigo-600">{tokenInfo.address}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="self-end space-x-8 text-xs text-white">
            <button
              onClick={toggleMenuHandler}
              className="px-2 py-0.5  rounded-full hover:scale-105 bg-black"
            >
              <Link to="/signup">회원가입</Link>
            </button>
            <button
              onClick={toggleMenuHandler}
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