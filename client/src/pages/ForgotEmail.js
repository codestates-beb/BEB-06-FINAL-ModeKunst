import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Button,
  EraseContentBtn,
  FormHeader,
  Input,
  Title,
} from "../components/form";

function ForgotEmail() {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const navigate = useNavigate();

  const onValid = async data => {
    try {
      const {
        data: {
          data: { email },
        },
      } = await axios.get(
        `http://localhost:8000/users/emailFind/${watch("nickname")}/${watch(
          "phone_number"
        )}`
      );
      Swal.fire({
        icon: "success",
        text: `${watch("nickname")}님의 이메일은 ${email} 입니다.`,
      }).then(() => {
        reset();
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "이메일을 찾을 수 없습니다. 확인 후 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <FormHeader title="이메일 찾기" />
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="닉네임" />
          <div className="relative">
            <Input
              register={register}
              id="nickname"
              type="text"
              message="닉네임"
            />
            <EraseContentBtn setValue={setValue} id="nickname" />
          </div>
        </div>
        <div className="flex flex-col space-y-1 tablet:space-y-2 desktop:space-y-3">
          <Title title="핸드폰 번호" />
          <div className="relative">
            <Input
              register={register}
              id="phone_number"
              type="text"
              message="핸드폰 번호"
              placeholder="-를 제외하고 입력해주세요"
            />
            <EraseContentBtn setValue={setValue} id="phone_number" />
          </div>
        </div>
        <Button message="검색" />
      </form>
    </div>
  );
}

export { ForgotEmail };
