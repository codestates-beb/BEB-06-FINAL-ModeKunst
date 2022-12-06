import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const passwordRe = watch("passwordRe");

  // 닉네임 검증용 상태
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDisabled, setNicknameDisabled] = useState(false);
  // 이메일 검증용 상태
  const [emailVerifyInput, setEmailVerifyInput] = useState(false);
  const [emailVerifyBtns, setEmailVerifyBtns] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState("");

  const onValid = async () => {
    if (emailVerified && nicknameChecked) {
      const result = await axios.post(
        "http://localhost:8000/admin/signup",
        {
          email: watch("email"),
          password: watch("password"),
          passwordcheck: watch("passwordRe"),
          nickname: watch("nickname"),
        }
        // { withCredentials: true }
      );
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: `${result.data.message}`,
        }).then(() => navigate(`/adminlogin`));
      }
      reset();
    } else {
      Swal.fire({
        icon: "warning",
        text: "닉네임 검증 혹은 이메일 인증을 반드시 진행해주세요.",
      });
    }
  };

  return (
    <div className="mt-64 max-w-3xl mx-auto">
      <div className="max-w-xl mx-auto mb-16">
        <button
          className="w-8 h-8 flex justify-center items-center rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white shadow-md"
          onClick={() => navigate(-1)}
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <h1 className="text-center font-bold text-slate-900 text-3xl">
          관리자 회원가입
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col items-center space-y-10"
      >
        {/* 이메일 */}
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-900 font-bold select-none">
            이메일
          </label>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                {...register("email", { required: "이메일을 입력하세요" })}
                type="text"
                disabled={emailDisabled}
                className="w-72 px-3 pb-1 text-sm border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none disabled:bg-white disabled:select-none"
              />
              {/* 인증 버튼 & 입력값삭제 버튼 */}
              {emailVerifyBtns && (
                <div className="flex items-center space-x-3 absolute right-3 -top-0.5">
                  <div
                    className="cursor-pointer select-none hover:scale-110"
                    onClick={async () => {
                      try {
                        if (watch("email") === "") {
                          Swal.fire({
                            icon: "warning",
                            text: "이메일을 입력하세요.",
                          });
                          return;
                        } else {
                          const result = await axios.get(
                            `http://localhost:8000/users/sendEmail/?email=${watch(
                              "email"
                            )}`
                          );
                          if (result.status === 200) {
                            setEmailVerifyInput(true);
                            setEmailDisabled(true);
                            Swal.fire({
                              icon: "success",
                              text: "인증코드가 발송되었습니다. 이메일을 확인해주세요.",
                            });
                          }
                        }
                      } catch (error) {
                        Swal.fire({
                          icon: "error",
                          text: "이미 가입된 이메일 입니다.",
                        });
                      }
                    }}
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
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => !emailDisabled && setValue("email", "")}
                    className="cursor-pointer select-none"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {/* 이메일 인증 완료 여부 표시 */}
            {!emailVerified ? (
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
          {emailVerifyInput && (
            <div className="flex space-x-2">
              <div className="flex justify-center items-center px-2 text-xs font-medium text-slate-500 rounded-md">
                인증코드
              </div>
              <input
                type="text"
                onChange={e => setEmailVerifyCode(e.target.value)}
                className="px-3 border-b-2 border-b-slate-500 w-1/3 focus:outline-none text-xs text-slate-400 font-medium"
              />
              {/* 이메일 인증코드 제출 버튼 */}
              <div
                className="flex justify-center items-center w-4 h-4 text-slate-400 hover:text-white hover:bg-slate-400 rounded-full cursor-pointer"
                onClick={async () => {
                  try {
                    const result = await axios.post(
                      "http://localhost:8000/users/checkEmail",
                      {
                        email: watch("email"),
                        code: emailVerifyCode,
                      }
                    );
                    if (result.status === 200) {
                      setEmailVerified(true);
                      setEmailVerifyBtns(false);
                      setEmailVerifyInput(false);
                      Swal.fire({
                        icon: "success",
                        text: "인증이 완료되었습니다. 회원가입을 계속 진행해주세요.",
                      });
                    }
                  } catch (error) {
                    Swal.fire({
                      icon: "error",
                      text: "인증코드가 일치하지 않습니다.",
                    });
                  }
                }}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </div>
          )}
          <span className="text-xs text-red-500 font-semibold">
            {errors?.email?.message}
          </span>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-900 font-bold select-none">
            닉네임
          </label>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                {...register("nickname", { required: "닉네임을 입력하세요" })}
                type="text"
                disabled={nicknameDisabled}
                className="w-72 px-3 text-sm border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none disabled:bg-white disabled:select-none"
              />
              {/* 닉네임 입력값 삭제 버튼 */}
              {nicknameChecked ? (
                // 닉네임 체크 완료 상태일 때
                // 닉네임 바꾸기 버튼
                <div
                  onClick={() => {
                    setValue("nickname", "");
                    setNicknameChecked(false);
                    setNicknameDisabled(false);
                  }}
                  className="inline-block absolute right-3 top-1 cursor-pointer"
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </div>
              ) : (
                // 닉네임 체크 미완료 상태일 때
                // 닉네임 체크버튼 & 닉네임 입력값 삭제버튼
                <div className="flex items-center space-x-3 absolute right-3 -top-0.5">
                  <div
                    className="cursor-pointer select-none hover:scale-110"
                    onClick={async () => {
                      try {
                        if (watch("nickname") === "") {
                          Swal.fire({
                            icon: "warning",
                            text: "닉네임을 입력하세요.",
                          });
                          return;
                        } else {
                          const result = await axios.get(
                            `http://localhost:8000/users/checkNickname/${watch(
                              "nickname"
                            )}`
                          );
                          if (result.status === 200) {
                            Swal.fire({
                              icon: "success",
                              text: `${result.data.message}`,
                            });
                            setNicknameChecked(true);
                            setNicknameDisabled(true);
                          }
                        }
                      } catch (error) {
                        console.log(error);
                        Swal.fire({
                          icon: "error",
                          text: "이미 사용 중인 닉네임 입니다.",
                        });
                      }
                    }}
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => {
                      setValue("nickname", "");
                    }}
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {/* 닉네임 검증 여부 표시 */}
            {!nicknameChecked ? (
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
          <span className="text-xs text-red-500 font-semibold">
            {errors?.nickname?.message}
          </span>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-900 font-bold select-none">
            비밀번호
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "비밀번호를 입력하세요" })}
              type="password"
              className="w-80 px-3 text-base border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none"
            />
            <div
              onClick={() => setValue("password", "")}
              className="inline-block absolute right-3 top-1 cursor-pointer"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <span className="text-xs text-red-500 font-semibold">
            {errors?.password?.message}
          </span>
        </div>

        {/* 비밀번호 RE */}
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-900 font-bold select-none">
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              {...register("passwordRe", { required: true })}
              type="password"
              className="w-80 px-3 text-base border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none"
            />
            <div
              onClick={() => setValue("passwordRe", "")}
              className="flex items-center space-x-3 absolute right-3 -top-0.5 cursor-pointer"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          {(!password && !passwordRe) || password !== passwordRe ? (
            <span className="text-xs text-red-500 font-semibold select-none">
              패스워드가 일치하지 않습니다
            </span>
          ) : (
            <span className="text-xs text-green-500 font-semibold select-none">
              패스워드가 일치합니다
            </span>
          )}
        </div>

        {/* 폼 제출 버튼 */}
        <button className="flex justify-center items-center p-2 text-white bg-slate-800 hover:scale-105 rounded-full select-none">
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

      <div className="mx-auto mt-20 w-3/4 border-b-double border-b-[1px] border-slate-900" />

      <div className="my-10 text-center">
        이미{" "}
        <span className="font-bold text-slate-900">
          <Link to="/adminlogin">관리자 계정</Link>
        </span>
        이 존재한다면?
      </div>
    </div>
  );
}

export { AdminSignup };
