import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import Swal from "sweetalert2";

function ResetPassword() {
  const userInfo = useSelector(state => state.user);
  const [samePw, setSamePw] = useState(false);
  const { email } = useParams();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    // formState: { errors },
  } = useForm();

  const newPassword = watch("firstPassword");
  const confirmPw = watch("secondPassword");

  useEffect(() => {
    if (newPassword === confirmPw) {
      if (newPassword) {
        setSamePw(true);
      } else {
        setSamePw(false);
      }
    }
  }, [newPassword, confirmPw]);

  const onValid = async (data, res) => {
    try {
      const result = await axios
        .post(`http://localhost:8000/users/${email}/pwupdate`, data, {
          withCredentials: true,
        })
        .then(console.log(res));
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: `${result.data.message}`,
        }).then(() => navigate("/"));
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "failure",
        text: `${e.message}`,
      });
    }
  };

  if (userInfo.isLoggedIn && userInfo.userInfo.email === email) {
    return (
      <div className="mt-16 py-10 max-w-3xl mx-auto bg-slate-900">
        <div className="max-w-xl mx-auto mb-16">
          <button className="w-8 h-8 flex justify-center items-center rounded-lg bg-violet-600 hover:bg-violet-700 shadow-md">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-slate-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h1 className="mt-12 text-center text-yellow-500 text-3xl font-bold select-none">
            비밀번호 수정
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col items-center space-y-16"
        >
          <div className="flex flex-col space-y-4">
            <label className="text-lg text-slate-100 font-bold select-none">
              새 비밀번호
            </label>

            <div className="relative">
              <input
                type="password"
                {...register("firstPassword", {
                  required: "새 비밀번호를 입력하세요.",
                })}
                className="w-80 px-3 pb-1 text-sm text-slate-100 bg-transparent border-b-2 focus:border-b-[3px] border-b-slate-300 focus:outline-none"
              />
              {!samePw && newPassword ? (
                <div className="mt-3 text-sm text-red-600">
                  비밀번호가 일치하지 않습니다.
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <label className="text-lg text-slate-100 font-bold select-none">
              새 비밀번호 확인
            </label>

            <div className="relative">
              <input
                type="password"
                {...register("secondPassword", {
                  required: "비밀번호 확인이 필요합니다.",
                })}
                className="w-80 px-3 pb-1 text-sm text-slate-100 bg-transparent border-b-2 focus:border-b-[3px] border-b-slate-300 focus:outline-none"
              />
              {!samePw && confirmPw ? (
                <div className="mt-3 text-sm text-red-600">
                  비밀번호가 일치하지 않습니다.
                </div>
              ) : (
                ""
              )}
              {
                <div>
                  <div className="flex items-center space-x-3 absolute right-3 -top-0.5">
                    {!samePw ? (
                      <div className="w-5 h-5 flex justify-center items-center text-xs text-red-500 font-medium rounded-full">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center text-xs text-green-500 font-medium rounded-full">
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
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              }
            </div>
          </div>
          {/* 🟠 폼 제출 버튼 */}
          <button
            onClick={handleSubmit}
            className="flex justify-center items-center p-2 text-white bg-slate-800 hover:scale-105 rounded-full select-none"
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    );
  }
}

export { ResetPassword };
