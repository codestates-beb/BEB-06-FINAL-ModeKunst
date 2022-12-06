import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  EraseContentBtn,
  FormHeader,
  Input,
  Title,
} from "../components/form";

function ResetPassword() {
  const navigate = useNavigate();
  const { email } = useParams();
  const { handleSubmit, register, setValue, reset, watch } = useForm();
  const firstPassword = watch("firstPassword");
  const secondPassword = watch("secondPassword");

  const onValid = async data => {
    try {
      const result = await axios.post(
        `http://localhost:8000/users/${email}/pwupdate`,
        data,
        { withCredentials: true }
      );
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: `${result.data.message}`,
        }).then(() => {
          reset();
          navigate("/");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "failure",
        text: `${error.message}`,
      });
    }
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <FormHeader title="비밀번호 수정" />
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="새 비밀번호" />
          <div className="relative">
            <Input
              register={register}
              id="firstPassword"
              message="비밀번호"
              type="password"
            />
            <EraseContentBtn setValue={setValue} id="password" />
          </div>
        </div>
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="새 비밀번호 확인" />
          <div className="relative">
            <Input
              register={register}
              id="secondPassword"
              message="비밀번호"
              type="password"
            />
            <EraseContentBtn setValue={setValue} id="passwordRe" />
          </div>
          {(!firstPassword && !secondPassword) ||
          firstPassword !== secondPassword ? (
            <span className="px-4 text-red-500 text-xs font-bold tablet:text-sm">
              패스워드가 일치하지 않습니다
            </span>
          ) : (
            <span className="px-4 text-green-500 text-xs font-bold tablet:text-sm">
              패스워드가 일치합니다
            </span>
          )}
        </div>
        <Button message="수정" />
      </form>
    </div>
  );
}

export { ResetPassword };
