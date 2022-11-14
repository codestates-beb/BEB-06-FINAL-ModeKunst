import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div>
      <h1>로그인</h1>
      <Link to="/">
        <button>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </button>
      </Link>

      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <label>이메일</label>
          <input
            {...register("email", { required: "이메일을 입력해주세요." })}
            type="text"
            placeholder="modekunst@gmail.com"
          />
        </div>
        <div>{errors?.email?.message}</div>
        <div>
          <label>비밀번호</label>
          <input
            {...register("password", { required: "비밀번호를 입력해주세요." })}
            type="password"
            placeholder="**********"
          />
        </div>
        <div>{errors?.password?.message}</div>
        <button type="submit">로그인</button>
      </form>
      <div />
      <hr />
      <div>
        <p>회원이 아니신가요?</p>
        <Link to="/signup">가입하기</Link>
      </div>
    </div>
  );
}

export { Login };
