import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

function ForgotEmail() {
  const { register, handleSubmit, watch } = useForm();
  const [targetEmail, setTargetEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    targetEmail &&
      Swal.fire({
        icon: "success",
        text: `${targetEmail}`,
      }).then(() => navigate("/login"));
  }, [targetEmail, navigate]);

  const onValid = async data => {
    try {
      const result = await axios.get(
        `http://localhost:8000/users/emailFind/${watch("nickname")}/${watch(
          "phone_number"
        )}`
      );
      setTargetEmail(result.data.data.email);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "이메일을 찾을 수 없습니다. 확인후 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <div className="max-w-xl mx-auto mb-32">
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
          이메일 찾기
        </h1>
      </div>

      {targetEmail ? (
        <span>{targetEmail}</span>
      ) : (
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col items-center space-y-16"
        >
          <div className="flex flex-col space-y-4">
            <label className="text-lg text-slate-900 font-bold select-none">
              닉네임
            </label>
            <input
              type="text"
              {...register("nickname")}
              className="w-72 px-3 pb-1 text-sm border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <label className="text-lg text-slate-900 font-bold select-none">
              핸드폰번호
            </label>
            <div>
              <input
                type="text"
                {...register("phone_number")}
                className="w-72 px-3 pb-1 text-sm border-b-2 focus:border-b-[3px] border-b-slate-800 focus:outline-none"
              />
            </div>
          </div>

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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}

export { ForgotEmail };
