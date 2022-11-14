import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/mode.png";

export default function Header() {
  const [isUser, setIsUser] = useState({ id: 1, nickname: "jason" });
  const navigate = useNavigate();

  return (
    // 추후에 bg-transparent & fixed 추가하는 거 고려
    <div className="mx-24 px-16 py-6 grid grid-cols-3 font-medium border-b-[3px] border-b-slate-700">
      <div className="self-end place-self-start grid grid-cols-2 gap-24">
        <div className="p-1 rounded-full hover:bg-yellow-100">
          <Link to="/">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </div>
        <div className="p-1 rounded-full hover:bg-yellow-100">
          <Link>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="select-none place-self-center relative group">
        <Link to="/">
          <img className="w-48 h-20" alt="logo" src={logo} />
          <span className="absolute bottom-10 right-0 w-0 h-1 bg-red-700 group-hover:w-full group-hover:transition-all"></span>
        </Link>
      </div>

      {isUser ? (
        <div className="self-end place-self-end grid grid-cols-4 gap-16">
          <div className="p-1 rounded-full hover:bg-lime-100 select-none flex justify-center items-center">
            <button>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
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
          </div>
          <div className="p-1 rounded-full hover:bg-yellow-100">
            <Link to="/write">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </Link>
          </div>
          <div className="p-1 rounded-full hover:bg-yellow-100">
            <Link to={`/user/${isUser.id}`}>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>
          </div>
          <div className="p-1 rounded-full hover:bg-red-100 select-none flex justify-center items-center">
            <button
              onClick={() => {
                setIsUser(prev => !prev);
                navigate("/");
              }}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
            {/* <span className="absolute left-0 -bottom-0.5 w-full h-0 bg-red-100 -z-10 group-hover:h-full group-hover:transition-all"></span> */}
          </div>
        </div>
      ) : (
        <div>
          <div>
            <Link to="/signup">회원가입</Link>
          </div>
          <div>
            <Link to="/login">로그인</Link>
          </div>
        </div>
      )}
    </div>
  );
}
