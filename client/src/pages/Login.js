import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// function cls(...classnames) {
//   return classnames.join(" ");
// }

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  //📌on Submit할 때 실행되는 함수
  const onValid = (data) => {
    setLoading(true);
    console.log(data);
    setValue("email", "");
    setValue("password", "");
    // navigate("/");
    setLoading(false);
  };

  return (
    <div className="mt-16 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center">로그인</h1>
      <div className="mt-4 flex flex-col">
        <div>
          <Link to="/">
            <button className="mt-2">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-black-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="grid gird-cols2">
              <label className="text-xl font-bold text-center">이메일</label>
              <input
                {...register("email", { required: "이메일을 입력해주세요." })}
                type="text"
                placeholder="modekunst@gmail.com"
                className="border-2 border-black rounded-md"
              />
            </div>
            <div>{errors?.email?.message}</div>
            <div className="mt-8 grid gird-cols2">
              <label className="text-xl font-bold text-center">비밀번호</label>
              <input
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                })}
                type="password"
                placeholder="**********"
                className="border-2 border-black rounded-md"
              />
            </div>
            <div>{errors?.password?.message}</div>
            <br />
            <button
              type="submit"
              className="mt-4 py-1 w-full border-b bg-black w-full text-white font-medium text-l rounded-md"
            >
              로그인
            </button>
          </form>
        </div>
        <hr />
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">회원이 아니신가요?</p>
          <Link to="/signup" className="font-bold">
            가입하기
          </Link>
        </div>
        <div className="mt-2 border-b-[1px] border-slate-800" />
        <div className="mt-4">
          <Link to="/forgot/email">
            <span className="font-bold">이메일</span>
          </Link>
          <span>이나</span>
          <Link to="/forgot/password">
            <span className="font-bold"> 비밀번호</span>
          </Link>
          <span>를 잊으셨나요?</span>
        </div>
      </div>
    </div>
  );
}

export { Login };
