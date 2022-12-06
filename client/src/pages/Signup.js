import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enterKeyDownHandler } from "../utils";
import {
  FormHeader,
  Title,
  ImagePreview,
  ImageUploader,
  VerifyBtns,
  VerifyInputs,
  VerifyIndicator,
  Input,
  Button,
  ErrorMessage,
  EraseContentBtn,
  NicknameChecked,
} from "../components/form";

function Signup() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const passwordRe = watch("passwordRe");

  // 이미지 미리보기 state
  const image = watch("profile_image");
  const [imagePreview, setImagePreview] = useState(null);
  // 닉네임 검증 state
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDisabled, setNicknameDisabled] = useState(false);
  // 이메일 검증 state
  const [emailVerifyInput, setEmailVerifyInput] = useState(false);
  const [emailVerifyBtns, setEmailVerifyBtns] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState("");
  // 폰번호 검증 state
  const [phoneVerifyInput, setPhoneVerifyInput] = useState(false);
  const [phoneVerifyBtns, setPhoneVerifyBtns] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(false);
  const [phoneVerifyCode, setPhoneVerifyCode] = useState("");

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  const nicknameCheckHandler = async () => {
    try {
      if (watch("nickname") === "") {
        Swal.fire({
          icon: "warning",
          text: "닉네임을 입력하세요",
        });
        return;
      } else {
        const result = await axios.get(
          `http://localhost:8000/users/checkNickname/${watch("nickname")}`
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
  };

  // 이메일 인증코드 발송
  const emailVerifyCodeHandler = async () => {
    try {
      if (watch("email") === "") {
        Swal.fire({
          icon: "warning",
          text: "이메일을 입력하세요.",
        });
        return;
      } else {
        const result = await axios.get(
          `http://localhost:8000/users/sendEmail/?email=${watch("email")}`
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
        text: "이미 가입된 이메일 입니다.",
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
          code: emailVerifyCode,
        }
      );
      if (result.status === 200) {
        setEmailVerified(true);
        setEmailVerifyBtns(false);
        setEmailVerifyInput(false);
        setEmailDisabled(true);
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
          `http://localhost:8000/users/sendSms/?phoneNumber=${watch(
            "phone_number"
          )}`
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
        phone_number: watch("phone_number"),
        code: phoneVerifyCode,
      });
      if (result.status === 200) {
        setPhoneVerified(true);
        setPhoneVerifyBtns(false);
        setPhoneVerifyInput(false);
        setPhoneDisabled(true);
        Swal.fire({
          icon: "success",
          text: "인증이 완료되었습니다. 회원가입을 계속 진행해주세요.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "오류가 발생했습니다. 잠시 후에 다시 시도해주세요.",
      });
    }
  };

  const onValid = async () => {
    if (emailVerified && phoneVerified && nicknameChecked) {
      const formData = new FormData();
      formData.append("profile_image", watch("profile_image")[0]);
      formData.append("email", watch("email"));
      formData.append("password", watch("password"));
      formData.append("nickname", watch("nickname"));
      formData.append("phone_number", watch("phone_number"));
      formData.append("height", watch("height"));
      formData.append("weight", watch("weight"));
      formData.append("gender", watch("gender"));
      formData.append("sns_url", watch("sns_url"));
      const result = await axios.post(
        "http://localhost:8000/users/signup",
        formData
      );
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: `${result.data.message}`,
        }).then(() => navigate("/"));
      }
      reset();
    } else {
      Swal.fire({
        icon: "warning",
        text: "닉네임 검증 혹은 이메일과 핸드폰 번호 인증을 반드시 진행해주세요.",
      });
    }
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <FormHeader title="회원가입" />
      <form
        onSubmit={handleSubmit(onValid)}
        onKeyDown={e => enterKeyDownHandler(e)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center space-y-2">
          {imagePreview ? (
            <ImagePreview image={imagePreview} imageHandler={setImagePreview} />
          ) : (
            <ImageUploader register={register} />
          )}
          <ErrorMessage error={errors.profile_image} />
        </div>

        {/* 이메일 */}
        <div className="flex flex-col space-y-4">
          <Title title="이메일" />
          <div className="relative flex space-x-2">
            <VerifyIndicator isVerified={emailVerified} />
            <Input
              register={register}
              id="email"
              type="email"
              message="이메일"
              disabled={emailDisabled}
            />
            <VerifyBtns
              btns={emailVerifyBtns}
              verifyHandler={emailVerifyCodeHandler}
              disabled={emailDisabled}
              setValue={setValue}
            />
          </div>
          <VerifyInputs
            verifyInput={emailVerifyInput}
            setVerifyCode={setEmailVerifyCode}
            verifyHandler={emailVerifyHandler}
          />
          <ErrorMessage error={errors.email} />
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col space-y-4">
          <Title title="닉네임" />
          <div className="relative flex space-x-2">
            <VerifyIndicator isVerified={nicknameChecked} />
            <Input
              register={register}
              id="nickname"
              type="text"
              message="닉네임"
              disabled={nicknameDisabled}
            />
            <NicknameChecked
              checked={nicknameChecked}
              setValue={setValue}
              setChecked={setNicknameChecked}
              setDisabled={setNicknameDisabled}
              checkHandler={nicknameCheckHandler}
            />
          </div>
          <ErrorMessage error={errors.nickname} />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col space-y-4">
          <Title title="비밀번호" />
          <div className="relative">
            <Input
              register={register}
              id="password"
              type="password"
              message="비밀번호"
            />
            <EraseContentBtn setValue={setValue} id="password" />
          </div>
          <ErrorMessage error={errors.password} />
        </div>
        {/* 비밀번호 확인 */}
        <div className="flex flex-col space-y-4">
          <Title title="비밀번호 확인" />
          <div className="relative">
            <Input
              register={register}
              id="passwordRe"
              type="password"
              message="비밀번호"
            />
            <EraseContentBtn setValue={setValue} id="passwordRe" />
          </div>
          {(!password && !passwordRe) || password !== passwordRe ? (
            <span className="px-4 text-red-500 text-xs font-bold tablet:text-sm">
              패스워드가 일치하지 않습니다
            </span>
          ) : (
            <span className="px-4 text-green-500 text-xs font-bold tablet:text-sm">
              패스워드가 일치합니다
            </span>
          )}
        </div>

        {/* 핸드폰 번호 */}
        <div className="flex flex-col space-y-4">
          <Title title="핸드폰 번호" />
          <div className="relative flex space-x-2">
            <VerifyIndicator isVerified={phoneVerified} />
            <Input
              register={register}
              id="phone_number"
              type="text"
              message="핸드폰 번호"
              disabled={phoneDisabled}
              placeholder="-를 제외하고 입력해주세요"
            />
            <VerifyBtns
              btns={phoneVerifyBtns}
              verifyHandler={smsVerifyCodeHandler}
              disabled={phoneDisabled}
              setValue={setValue}
            />
          </div>
          <VerifyInputs
            verifyInput={phoneVerifyInput}
            setVerifyCode={setPhoneVerifyCode}
            verifyHandler={smsVerifyHandler}
          />
          <ErrorMessage error={errors.phone_number} />
        </div>

        {/* 신체 정보 */}
        <div className="flex flex-col space-y-4">
          <Title title="신체 정보" />
          <div className="flex space-x-10 justify-between">
            <div className="grow flex flex-col space-y-3">
              <Title title2="키(cm)" />
              <Input
                register={register}
                id="height"
                type="text"
                message="키"
                placeholder="소수점 제외"
              />
              <ErrorMessage error={errors.height} />
            </div>
            <div className="grow flex flex-col space-y-3">
              <Title title2="체중(kg)" />
              <Input
                register={register}
                id="weight"
                type="text"
                message="몸무게"
                placeholder="소수점 제외"
              />
              <ErrorMessage error={errors.weight} />
            </div>
          </div>
        </div>

        {/* 성별 */}
        <div className="flex flex-col space-y-2">
          <Title title="성별" />
          <select
            {...register("gender")}
            className="w-full px-4 py-2 border-2 border-black bg-transparent text-slate-800 focus:outline-none rounded-md"
          >
            <option value="male">남자</option>
            <option value="female">여자</option>
            <option value="other">미선택</option>
          </select>
        </div>

        {/* SNS URL */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="p-0.5 w-6 h-6 fill-white stroke-1 bg-gradient-to-tr from-yellow-300 to-pink-600 rounded-md tablet:w-8 tablet:h-8"
            >
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
            <label className="flex items-center px-4 text-lg font-semibold tablet:text-2xl">
              SNS URL
              <span className="ml-2 px-1 py-0.5 text-xs font-medium text-white bg-slate-900 rounded-xl">
                선택사항
              </span>
            </label>
          </div>
          <input
            {...register("sns_url")}
            type="text"
            className="w-full px-8 pb-0.5 border-b-2 border-black bg-transparent text-slate-800 focus:outline-none focus:border-b-[3px] tablet:pb-1"
          />
        </div>

        <Button message="가입하기" />
      </form>
      <div className="space-y-3">
        <div className="w-3/4 mx-auto mt-10 border-b-[1px] border-slate-800 tablet:mt-16 desktop:mt-24" />
        <div className="text-xs tablet:text-sm">
          이미{" "}
          <span className="text-sm font-bold tablet:text-base">
            <Link to="/login">계정</Link>
          </span>
          이 있으신가요?
        </div>
      </div>
    </div>
  );
}

export { Signup };
