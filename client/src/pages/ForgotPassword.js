import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import cls from "../utils/setClassnames";
import {
  Button,
  EraseContentBtn,
  ErrorMessage,
  FormHeader,
  Input,
  Title,
  VerifyInputs,
} from "../components/form";
import { useSelector } from "react-redux";

function ForgotPassword() {
  const { isLoggedIn } = useSelector(state => state.user);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [verifyMethod, setVerifyMethod] = useState("email");
  const [verifyCode, setVerifyCode] = useState("");
  const [emailVerifyInput, setEmailVerifyInput] = useState(false);
  const [phoneVerifyInput, setPhoneVerifyInput] = useState(false);

  useEffect(() => {
    isLoggedIn && navigate("/");
  }, []);

  // 이메일 인증코드 발송
  const emailVerifyCodeHandler = async () => {
    try {
      if (watch("email") === "") {
        Swal.fire({
          icon: "warning",
          text: "이메일을 입력하세요.",
        });
      } else {
        const result = await axios.get(
          `http://localhost:8000/users/sendEmail/?email=${watch(
            "email"
          )}&phoneNumber=${watch("phone")}`
        );
        if (result.status === 200) {
          setEmailVerifyInput(true);
          Swal.fire({
            icon: "success",
            text: "인증코드가 발송되었습니다. 이메일을 확인해주세요.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error.message}`,
      });
    }
  };

  // 이메일 인증코드
  const emailVerifyHandler = async () => {
    try {
      const result = await axios.post(
        "http://localhost:8000/users/checkEmail",
        {
          email: watch("email"),
          code: verifyCode,
        }
      );
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: "인증이 완료되었습니다. 비밀번호를 변경해주세요.",
        }).then(() => navigate(`/reset/password/${watch("email")}`));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error.message}`,
      });
    }
  };

  // 문자 인증코드 발송
  const smsVerifyCodeHandler = async () => {
    try {
      if (watch("phone_number") === "") {
        Swal.fire({
          icon: "warning",
          text: "핸드폰 번호를 입력하세요.",
        });
      } else {
        const result = await axios.get(
          `http://localhost:8000/users/sendSms/?email=${watch(
            "email"
          )}&phoneNumber=${watch("phone")}`
        );
        if (result.status === 200) {
          setPhoneVerifyInput(true);
          Swal.fire({
            icon: "success",
            text: "인증코드가 발송되었습니다. 핸드폰을 확인해주세요.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error.message}`,
      });
    }
  };

  // 문자 인증코드
  const smsVerifyHandler = async () => {
    try {
      const result = await axios.post("http://localhost:8000/users/checkSms", {
        phone_number: watch("phone"),
        code: verifyCode,
      });
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: "인증이 완료되었습니다. 비밀번호를 변경해주세요.",
        }).then(() => navigate(`/reset/password/${watch("email")}`));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error.message}`,
      });
    }
  };

  const onValid = () => {
    // DON'T ERASE
    // 현 페이지의 폼은 기존과 다르게 사용됨.
    // 제출 버튼이 존재하지만 폼의 내용을 제출하는 것이 아니라 이메일 및 핸드폰 인증 관련 기능을 담당함
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <FormHeader title="비밀번호 찾기" />
      <div className="mx-auto mb-12 space-y-6 flex flex-col items-center max-w-xl tablet:mb-16 tablet:space-y-10 desktop:mb-20">
        <h3 className="text-lg font-semibold tablet:text-2xl">인증방법</h3>
        <div className="space-x-8 tablet:space-x-16 desktop:space-x-24">
          <button
            onClick={() => {
              setVerifyMethod("email");
              setValue("phone", "");
            }}
            className={cls(
              "px-2 py-1 rounded-full shadow-lg text-xs font-medium hover:scale-105 tablet:px-4 tablet:text-sm tablet:font-semibold",
              verifyMethod === "email"
                ? "text-slate-100 bg-yellow-500"
                : " text-slate-100 bg-black"
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
              "px-2 py-1 rounded-full shadow-lg text-xs font-medium hover:scale-105 tablet:px-4 tablet:text-sm tablet:font-semibold",
              verifyMethod === "phone"
                ? "text-slate-100 bg-yellow-500"
                : "text-slate-100 bg-black"
            )}
          >
            핸드폰
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="이메일" />
          <div className="relative">
            <Input
              register={register}
              id="email"
              message="이메일"
              type="text"
            />
            <EraseContentBtn setValue={setValue} id="email" />
          </div>
          <ErrorMessage error={errors.email} />
        </div>
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="핸드폰 번호" />
          <div className="relative">
            <Input
              register={register}
              id="phone"
              message="핸드폰 번호"
              type="text"
            />
            <EraseContentBtn setValue={setValue} id="phone" />
          </div>
          <ErrorMessage error={errors.phone} />
        </div>
        {verifyMethod === "email" ? (
          <Button
            clickHandler={emailVerifyCodeHandler}
            message="인증코드 발송"
          />
        ) : (
          <Button clickHandler={smsVerifyCodeHandler} message="인증코드 발송" />
        )}
      </form>
      <VerifyInputs
        verifyInput={
          verifyMethod === "email" ? emailVerifyInput : phoneVerifyInput
        }
        setVerifyCode={setVerifyCode}
        verifyHandler={
          verifyMethod === "email" ? emailVerifyHandler : smsVerifyHandler
        }
      />
    </div>
  );
}

export { ForgotPassword };
