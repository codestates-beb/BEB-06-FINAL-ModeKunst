import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../store/user";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  Title,
  FormHeader,
  Input,
  Button,
  ErrorMessage,
  EraseContentBtn,
} from "../components/form";

function Login() {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.user);
  const { isAdmin } = useSelector(state => state.admin);

  useEffect(() => {
    if (isLoggedIn || isAdmin) {
      Swal.fire({
        icon: "info",
        text: "이미 로그인 된 상태입니다.",
      });
      navigate("/");
    }
  }, []);

  const onValid = data => {
    dispatch(login(data));
    reset();
    navigate("/");
  };

  return (
    <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      <FormHeader title="로그인" />
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
        <div className="flex flex-col space-y-2 tablet:space-y-2 desktop:space-y-3">
          <Title title="비밀번호" />
          <div className="relative">
            <Input
              register={register}
              id="password"
              message="비밀번호"
              type="password"
            />
            <EraseContentBtn setValue={setValue} id="password" />
          </div>
          <ErrorMessage error={errors.password} />
        </div>
        <Button message="로그인" />
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
