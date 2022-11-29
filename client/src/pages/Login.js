import { login } from "../store/user";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  // const userInfo = useSelector((state) => state.user);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onValid = data => {
    dispatch(login(data));
    setValue("email", "");
    setValue("password", "");
    navigate("/");
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <div className="w-full relative mb-10 tablet:w-3/5 tablet:mb-20 desktop:w-1/2 desktop:mb-24">
        <button
          className="p-1 absolute top-2 left-0"
          onClick={() => navigate(-1)}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 tablet:w-5 tablet:h-5 desktop:w-6 desktop:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-title text-center tablet:text-4xl desktop:text-5xl">
          로그인
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <label className="px-4 text-lg font-semibold tablet:text-2xl">
            이메일
          </label>
          <div className="relative">
            <input
              {...register("email", { required: "이메일을 입력해주세요" })}
              type="text"
              className="w-full px-4 pb-0.5 border-b-2 border-black bg-transparent text-slate-800 focus:outline-none focus:border-b-[3px]"
            />
            <div
              onClick={() => setValue("email", "")}
              className="absolute right-3 top-1 inline-block cursor-pointer hover:scale-110 tablet:top-0 tablet:hover:scale-125"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-4 tablet:h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <span className="px-4 text-red-500 text-xs font-bold tablet:text-sm">
            {errors?.email?.message}
          </span>
        </div>
        <div className="flex flex-col space-y-2 tablet:space-y-2 desktop:space-y-3">
          <label className="px-4 text-lg font-semibold tablet:text-2xl">
            비밀번호
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "비밀번호를 입력해주세요",
              })}
              type="password"
              className="w-full px-4 pb-0.5 border-b-2 border-black bg-transparent text-slate-800 focus:outline-none focus:border-b-[3px]"
            />
            <div
              onClick={() => setValue("password", "")}
              className="absolute right-3 top-1 inline-block cursor-pointer hover:scale-110 tablet:top-0 tablet:hover:scale-125"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-4 tablet:h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <span className="px-4 text-red-500 text-xs font-bold tablet:text-sm">
            {errors?.password?.message}
          </span>
        </div>
        <button
          type="submit"
          className="w-full block mx-auto bg-black text-white font-semibold py-1 rounded-md cursor-pointer hover:bg-yellow-500"
        >
          로그인
        </button>
      </form>
      <div className="space-y-3">
        <div className="w-3/4 mx-auto mt-10 border-b-[1px] border-slate-800 tablet:mt-16 desktop:mt-24" />
        <div className="flex flex-col space-y-4 text-slate-900">
          <div className="text-center">
            <p className="text-xs tablet:text-sm">회원이 아니신가요?</p>
            <Link
              to="/signup"
              className="text-sm font-bold hover:text-yellow-500 tablet:text-base"
            >
              가입하기
            </Link>
          </div>
          <div>
            <Link
              to="/forgot/email"
              className="text-sm font-bold hover:text-blue-600 tablet:text-base"
            >
              이메일
            </Link>{" "}
            <span className="text-xs tablet:text-sm">혹은</span>{" "}
            <Link
              to="/forgot/password"
              className="text-sm font-bold hover:text-blue-600 tablet:text-base"
            >
              비밀번호
            </Link>
            <span className="text-xs tablet:text-sm">를 잊으셨나요?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
