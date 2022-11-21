import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

function cls(...classnames) {
  return classnames.join(" ");
}

function ForgotPassword() {
  // 인증방법 선택
  const [verifyMethod, setVerifyMethod] = useState("email");
  // 이메일 검증용 상태
  const [emailVerifyInput, setEmailVerifyInput] = useState(false);
  const [emailVerifyBtn, setEmailVerifyBtn] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState("");
  // 핸드폰 검증용 상태
  const [phoneVerifyInput, setPhoneVerifyInput] = useState(false);
  const [phoneVerifyBtns, setPhoneVerifyBtns] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(false);
  const [phoneVerifyCode, setPhoneVerifyCode] = useState("");
  const navigate = useNavigate();

  const { handleSubmit, register, setValue, watch } = useForm();

  const onValid = data => {
    axios
      .get(
        `http://localhost:8000/users/pwfind/${watch("email")}/${watch("phone")}`
      )
      .then(console.log)
      .catch(console.log);
  };

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
        <h1 className="text-center text-yellow-500 text-3xl font-bold select-none">
          비밀번호 찾기
        </h1>
      </div>

      <div className="mx-auto mb-12 space-y-6 flex flex-col items-center max-w-xl">
        <h3 className="text-xl text-slate-100 font-semibold">인증방법</h3>
        <div className="space-x-20">
          <button
            onClick={() => {
              setVerifyMethod("email");
              setValue("phone", "");
            }}
            className={cls(
              "text-sm font-semibold px-4 py-1 rounded-full shadow-xl hover:scale-105",
              verifyMethod === "email"
                ? "text-slate-100 bg-violet-700"
                : " text-slate-100 bg-violet-400"
            )}
          >
            이메일
          </button>
          <button
            onClick={() => {
              setVerifyMethod("phone");
              setValue("email", "");
            }}
            className={cls(
              "text-sm font-semibold px-4 py-1 rounded-full shadow-xl hover:scale-105",
              verifyMethod === "phone"
                ? "text-slate-100 bg-violet-700"
                : "text-slate-100 bg-violet-400"
            )}
          >
            핸드폰
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col items-center space-y-16"
      >
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-100 font-bold select-none">
            이메일
          </label>

          <div className="relative">
            <input
              type="text"
              {...register("email", { required: "이메일을 입력하세요" })}
              className="w-80 px-3 pb-1 text-sm text-slate-100 bg-transparent border-b-2 focus:border-b-[3px] border-b-slate-300 focus:outline-none"
            />
            {/* 🟢 입력값삭제 버튼 */}
            <div className="flex items-center space-x-3 absolute right-3 top-1.5">
              <div
                onClick={() => !emailDisabled && setValue("email", "")}
                className="cursor-pointer select-none"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3 h-3 text-slate-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* 🟢 이메일 검증코드 제출하기 버튼 */}
        </div>

        <div className="flex flex-col space-y-4">
          <label className="text-lg text-slate-100 font-bold select-none">
            핸드폰 번호
          </label>

          <div className="relative">
            <input
              type="text"
              {...register("phone", { required: "핸드폰 번호를 입력하세요" })}
              className="w-80 px-3 pb-1 text-sm text-slate-100 bg-transparent border-b-2 focus:border-b-[3px] border-b-slate-300 focus:outline-none"
            />
            {/* 🟠 핸드폰 번호 */}
            {/* 🟢 검증 버튼 & 입력값삭제 버튼 & 이메일 검증 여부 표시 */}
            {verifyMethod === "phone" && (
              <div>
                <div className="flex items-center space-x-3 absolute right-3 -top-0.5">
                  <div
                    onClick={() => {
                      setPhoneVerifyInput(true);
                      setPhoneDisabled(true);
                      axios
                        .get(
                          `http://localhost:8000/users/sendSms/?email=${watch(
                            "email"
                          )}&phoneNumber=${watch("phone")}`
                        )
                        .then(result => alert(result.data.message));
                    }}
                    className="cursor-pointer select-none hover:scale-110"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => !phoneDisabled && setValue("phone", "")}
                    className="cursor-pointer select-none"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3 text-slate-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
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
              </div>
            )}
          </div>
          {/* 🟢 핸드폰 번호 검증코드 제출하기 버튼 */}
          {phoneVerifyInput && (
            <div className="flex space-x-2">
              <div className="flex justify-center items-center px-2 text-xs font-medium text-slate-500 rounded-md">
                인증코드
              </div>
              <input
                type="text"
                onChange={e => setPhoneVerifyCode(e.target.value)}
                className="px-3 border-b-2 border-b-slate-500 w-1/3 focus:outline-none text-xs text-slate-400 font-medium"
              />
              <div
                onClick={async () => {
                  try {
                    const data = await axios.post(
                      "http://localhost:8000/users/checkSms",
                      {
                        email: watch("phone"),
                        code: emailVerifyCode,
                      }
                    );
                    if (data.status === 200) {
                      setPhoneVerifyBtns(false);
                      setPhoneVerifyInput(false);
                      setPhoneVerified(true);
                      alert("인증이 완료되었습니다");
                    }
                  } catch (error) {
                    alert("인증을 진행할 수 없습니다", error.toString());
                  }
                }}
                className="flex justify-center items-center w-4 h-4 text-slate-400 hover:text-white hover:bg-slate-400 rounded-full cursor-pointer"
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
        </div>

        {verifyMethod === "email" ? (
          <div>
            {/* 로직
              1) 검증버튼 누르면 인증코드 입력란이 보여지고
              2) 검증버튼은 사라진다
            */}
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
                <div
                  onClick={async () => {
                    try {
                      const data = await axios.post(
                        "http://localhost:8000/users/checkEmail",
                        {
                          email: watch("email"),
                          code: emailVerifyCode,
                        }
                      );
                      if (data.status === 200) {
                        Swal.fire({
                          icon: "success",
                          text: "인증이 완료되었습니다. 비밀번호 변경 페이지로 이동합니다.",
                        }).then(() => navigate("/reset/password"));
                        // 잘못된 인증코드를 입력한다면??????
                      }
                    } catch (error) {
                      Swal.fire({
                        icon: "error",
                        text: "올바르지 않은 인증코드입니다.",
                      });
                    }
                  }}
                  className="flex justify-center items-center w-4 h-4 text-slate-400 hover:text-white hover:bg-slate-400 rounded-full cursor-pointer"
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
            {emailVerifyBtn && (
              <div
                onClick={async () => {
                  try {
                    await axios.get(
                      `http://localhost:8000/users/sendEmail/?email=${watch(
                        "email"
                      )}&phoneNumber=${watch("phone")}`
                    );
                    setEmailVerifyInput(true);
                    setEmailDisabled(true);
                    setEmailVerifyBtn(false);
                    Swal.fire({
                      icon: "success",
                      text: "입력하신 이메일로 인증코드가 발송되었습니다.",
                    });
                  } catch (error) {
                    Swal.fire({
                      icon: "error",
                      text: "인증을 진행할 수 없습니다. 입력하신 정보를 확인해주세요.",
                    });
                  }
                }}
                className="flex justify-center items-center p-2 bg-violet-700 hover:scale-105 rounded-full cursor-pointer"
              >
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            )}
          </div>
        ) : null}
      </form>
    </div>
  );
}

export { ForgotPassword };
