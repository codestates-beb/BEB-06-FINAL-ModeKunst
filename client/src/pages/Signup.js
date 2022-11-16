import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [phoneVerify, setPhoneVerify] = useState(false);
  const image = watch("profile_image");
  const navigate = useNavigate();

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  const onValid = formData => {
    if (formData.password !== formData.passwordRe) {
      setError(
        "passwordRe",
        {
          message: "입력하신 패스워드가 일치하지 않습니다",
        },
        { shouldFocus: true }
      );
    }
    reset();
    window.alert("가입이 완료되었습니다");
    navigate("/");
  };

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="flex">
        <button
          className="relative -left-20 hover:scale-110"
          onClick={() => navigate(-1)}
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1 className="relative -left-4 text-3xl font-bold select-none">
          회원가입
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col justify-center items-center space-y-10"
      >
        {/* 🟠 이미지 파일 */}
        <div className="flex flex-col">
          <div className="mt-8">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="profile_image_preview"
                  className="w-44 h-44 rounded-full shadow-xl"
                />
                <button
                  onClick={() => setImagePreview("")}
                  className="absolute -top-1 -right-1 w-6 h-6 flex justify-center items-center bg-pink-300 hover:bg-pink-400 rounded-full"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <label className="flex flex-col space-y-2 justify-center items-center w-44 h-44 rounded-full bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 cursor-pointer">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-8 text-slate-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-slate-800">
                    ADD profile
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register(
                      "profile_image",
                      {
                        required: "프로필 이미지를 등록하세요",
                      },
                      { shouldFocus: true }
                    )}
                  />
                </label>
                <span className="text-xs text-red-500 font-semibold">
                  {errors?.profile_image?.message}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 🟠 이메일 */}
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-bold select-none">이메일</label>
          <div className="flex space-x-2">
            <input
              {...register("email", { required: "이메일을 입력하세요" })}
              type="text"
              disabled={emailVerify}
              className="w-72 px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm disabled:bg-slate-300"
            />
            <div
              onClick={() => setEmailVerify(true)}
              className="flex justify-center items-center w-10 h-10 bg-slate-800 hover:scale-105 rounded-md text-white cursor-pointer"
            >
              인증
            </div>
          </div>
          {emailVerify && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="인증코드를 입력하세요"
                className="px-3 py-2 rounded-lg shadow-md text-sm bg-slate-50 hover:bg-slate-100 focus:outline-none"
              />
              <div
                onClick={() => {
                  // axios
                }}
                className="flex justify-center items-center w-10 h-10 bg-slate-800 hover:scale-105 rounded-md text-white cursor-pointer"
              >
                확인
              </div>
            </div>
          )}
          <span className="text-xs text-red-500 font-semibold">
            {errors?.email?.message}
          </span>
        </div>

        {/* 🟠 닉네임 */}
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-bold select-none">닉네임</label>
          <input
            {...register("nickname", { required: "닉네임을 입력하세요" })}
            type="text"
            className="w-72 px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm"
          />
          <span className="text-xs text-red-500 font-semibold">
            {errors?.nickname?.message}
          </span>
        </div>

        {/* 🟠 비밀번호 */}
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-2">
            <label className="text-xl font-bold select-none">비밀번호</label>
            <input
              {...register("password", { required: "비밀번호를 입력하세요" })}
              type="password"
              className="w-52 px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm"
            />
            <span className="text-xs text-red-500 font-semibold">
              {errors?.password?.message}
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xl font-bold select-none">
              비밀번호 확인
            </label>
            <input
              {...register("passwordRe", { required: true })}
              type="password"
              className="w-52 px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm"
            />
            <span className="text-xs text-red-500 font-semibold">
              {errors?.passwordRe?.message}
            </span>
          </div>
        </div>

        {/* 🟠 핸드폰 번호 */}
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-bold select-none">핸드폰 번호</label>
          <div className="flex space-x-2">
            <input
              {...register("phone", { required: "핸드폰 번호를 입력하세요" })}
              type="text"
              disabled={phoneVerify}
              placeholder="-를 제외하고 입력해주세요"
              className="w-72 placeholder:text-xs px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm disabled:bg-slate-300"
            />
            <div
              onClick={() => setPhoneVerify(true)}
              className="flex justify-center items-center w-10 h-10 bg-slate-800 hover:scale-105 rounded-md text-white cursor-pointer"
            >
              인증
            </div>
          </div>
          {phoneVerify && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="인증코드를 입력하세요"
                className="px-3 py-2 rounded-lg shadow-md text-sm bg-slate-50 hover:bg-slate-100 focus:outline-none"
              />
              <div
                onClick={() => {
                  // axios
                }}
                className="flex justify-center items-center w-10 h-10 bg-slate-800 hover:scale-105 rounded-md text-white cursor-pointer"
              >
                확인
              </div>
            </div>
          )}
          <span className="text-xs text-red-500 font-semibold">
            {errors?.phone?.message}
          </span>
        </div>

        {/* 🟠 신체 정보 */}
        <div className="flex flex-col space-y-2">
          <span className="text-xl font-bold select-none">신체 정보</span>
          <div className="flex space-x-4">
            <div className="flex flex-col space-y-2">
              <label className="text-md font-medium select-none">신장</label>
              <div className="flex">
                <input
                  {...register("height", { required: "신장을 입력하세요" })}
                  type="text"
                  placeholder="소수점 제외"
                  className="placeholder:text-xs px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md rounded-r-none text-sm"
                />
                <span className="flex justify-center items-center select-none px-2 rounded-r-md border border-l-0 bg-gray-50 text-sm">
                  cm
                </span>
              </div>
              <span className="text-xs text-red-500 font-semibold">
                {errors?.height?.message}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-md font-medium select-none">체중</label>
              <div className="flex">
                <input
                  {...register("weight", { required: "체중을 입력하세요" })}
                  type="text"
                  placeholder="소수점 제외"
                  className="placeholder:text-xs px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md rounded-r-none text-sm"
                />
                <span className="flex justify-center items-center select-none px-2 rounded-r-md border border-l-0 bg-gray-50 text-sm">
                  kg
                </span>
              </div>
              <span className="text-xs text-red-500 font-semibold">
                {errors?.weight?.message}
              </span>
            </div>
          </div>
        </div>

        {/* 🟠 성별 */}
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-bold select-none">성별</label>
          <select
            {...register("gender", { required: "성별을 선택하세요" })}
            className="px-2 py-1 border-0 rounded-md cursor-pointer drop-shadow-md w-20 duration-300 bg-slate-100 hover:bg-slate-200 focus:outline-none text-sm"
          >
            <option value="male">남자</option>
            <option value="female">여자</option>
            <option value="other">미선택</option>
          </select>
          <span className="text-xs text-red-500 font-semibold">
            {errors?.gender?.message}
          </span>
        </div>

        {/* 🟠 SNS URL */}
        <div className="flex flex-col space-y-2">
          <label className="text-xl font-bold select-none">SNS URL</label>
          <input
            {...register("snsUrl")}
            type="text"
            className="w-72 px-4 py-2 border-[1px] border-slate-500 focus:outline-none hover:bg-slate-100 rounded-md text-sm"
          />
        </div>

        <button className="mx-auto px-4 py-1 text-white bg-slate-800 hover:bg-black rounded-xl select-none">
          가입하기
        </button>
      </form>

      <div className="mt-12 w-64 border-b-2 border-slate-800" />

      <div className="flex flex-col items-center select-none">
        <div className="mt-8 mb-4">
          이미{" "}
          <span className="font-bold">
            <Link to="/login">계정</Link>
          </span>
          이 존재한다면?
        </div>
      </div>
    </div>
  );
}

export { Signup };
