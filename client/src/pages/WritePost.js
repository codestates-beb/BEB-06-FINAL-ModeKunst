//📌 to do
//1. formData append 데이터 싹 정리해놓기 (v)
//2. 작성한 data를 redux로 관리할것인지?
//2-1. upstream = true 일 경우 fashion info 모든 값이 null 값이 아니어야됨
//3. 사진 누르면 배열에서 요소 삭제하기 (v)
//4. UI 개선하기
//5. image 최소 3장, 최대 5장(v)
//6. 유효성 검사(최소 내용 글자 수, fashion info)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  ErrorMessage,
  FormHeader,
  Input,
  Title,
} from "../components/form";

const writePageVar = {
  enter: { opacity: 0 },
  visible: { opacity: 1 },
  invisible: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

function WritePost() {
  const { isLoggedIn } = useSelector(state => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 체크박스, 이미지 input 값 상태관리
  const [isChecked, setIsChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const navigate = useNavigate();

  // 이미지 업로드 함수
  const uploadImageHandler = e => {
    let reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      if (multipleImages && multipleImages.length === 5) {
        Swal.fire({
          icon: "info",
          text: "이미지는 5장까지 업로드 가능합니다.",
        });
      } else {
        setMultipleImages([...multipleImages, e.target.files[0]]);
        // console.log(multipleImages);
      }
    }
    reader.onloadend = () => {
      const previewImgUrl = reader.result;
      if (previewImgUrl) {
        setImagePreview([...imagePreview, previewImgUrl]);
      }
    };
  };

  // 이미지 미리보기 함수
  const getPreviewImg = () => {
    return multipleImages.map((_, idx) => (
      <div key={idx} className="relative">
        <div className="p-0.5 bg-black rounded-md overflow-hidden">
          <img
            alt="upload_image"
            src={imagePreview[idx]}
            className="w-full h-48 object-cover aspect-square hover:opacity-75"
          />
        </div>
        <button
          onClick={() => removeImageHandler(idx)}
          className="absolute -top-2 -right-1"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="p-1 w-5 h-5 bg-yellow-500 stroke-white rounded-full hover:scale-110"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ));
  };

  // 이미지 삭제 함수
  const removeImageHandler = index => {
    const imgArr = multipleImages.filter((el, i) => i !== index);
    const imgNameArr = imagePreview.filter((el, i) => i !== index);
    setMultipleImages([...imgArr]);
    setImagePreview([...imgNameArr]);
  };

  // fashion info 체크 함수
  const checkHandler = e => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      Swal.fire({
        icon: "info",
        text: "Fashion Info를 작성해주시면 10 NODE를 수령합니다. 정성껏 작성해주세요.",
      });
    }
  };

  // 아우터 정보 넣을지 말지
  const infoAddHandler = e => {
    setIsAdded(true);
  };

  const onValid = data => {
    if (multipleImages?.length < 3) {
      Swal.fire({
        icon: "info",
        text: "사진은 3장 이상 업로드해주세요.",
      });
    } else {
      const formData = new FormData();
      const {
        title,
        contents,
        category,
        upstream,
        outer_brand,
        top_brand,
        pants_brand,
        shoes_brand,
        outer_name,
        top_name,
        pants_name,
        shoes_name,
        outer_size,
        top_size,
        pants_size,
        shoes_size,
      } = data;
      // console.log(top_brand);
      const image_1 = multipleImages[0];
      const image_2 = multipleImages[1];
      const image_3 = multipleImages[2];
      const image_4 = multipleImages[3];
      const image_5 = multipleImages[4];

      formData.append("title", title);
      formData.append("content", contents);
      formData.append("category", category);
      formData.append("haveInfo", isChecked);
      formData.append("top_post", upstream);
      formData.append("outer_brand", outer_brand);
      formData.append("outer_name", outer_name);
      formData.append("outer_size", outer_size);
      formData.append("top_brand", top_brand);
      formData.append("top_name", top_name);
      formData.append("top_size", top_size);
      formData.append("pants_brand", pants_brand);
      formData.append("pants_name", pants_name);
      formData.append("pants_size", pants_size);
      formData.append("shoes_brand", shoes_brand);
      formData.append("shoes_name", shoes_name);
      formData.append("shoes_size", shoes_size);
      formData.append("image", image_1);
      formData.append("image", image_2);
      formData.append("image", image_3);
      formData.append("image", image_4);
      formData.append("image", image_5);

      axios
        .post("http://localhost:8000/posts/board", formData, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          console.log(data);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
          navigate(`/post/${data.data.postId}`);
        })
        .catch(error => {
          console.log(error);
          Swal.fire({
            icon: "info",
            text: `${error.response.data.message}`,
          });
        });
    }
  };

  return (
    <motion.div
      variants={writePageVar}
      initial="enter"
      animate="visible"
      exit="invisible"
      className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none"
    >
      <FormHeader title="게시물 작성" />
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
      >
        <div className="flex flex-col space-y-4">
          <Title title="제목" />
          <Input register={register} id="title" type="text" message="제목" />
          <ErrorMessage error={errors.title} />
        </div>
        <div className="flex flex-col space-y-4">
          <Title title="내용" />
          <textarea
            {...register("contents", {
              required: "내용을 입력해주세요.",
            })}
            type="text"
            className="px-4 py-2 text-sm bg-transparent border-2 border-black rounded-md focus:outline-none focus:border-[3px]"
          />
          <ErrorMessage error={errors.contents} />
        </div>
        <div className="flex flex-col space-y-4">
          <Title title="카테고리" />
          <select
            defaultValue="casual"
            {...register("category", {
              required: "카테고리를 선택해주세요.",
            })}
            className="px-2 py-1 text-sm bg-transparent border-2 border-black rounded-md focus:outline-none focus:border-[3px]"
          >
            <option value="casual">캐주얼</option>
            <option value="dandy">댄디</option>
            <option value="normcore">놈코어</option>
            <option value="street">스트릿</option>
          </select>
        </div>
        <div className="flex flex-col space-y-4">
          <Title title="이미지" />
          <div className="space-y-4">
            <label className="w-1/5 px-4 py-2 mx-auto flex flex-col justify-center items-center bg-violet-700 hover:bg-yellow-500 rounded-full cursor-pointer">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                className="w-4 h-4 stroke-slate-50 tablet:w-5 tablet:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="text-xs font-semibold text-slate-50">
                {multipleImages ? <div>{multipleImages.length} / 5</div> : null}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadImageHandler}
                required
              />
              <ErrorMessage error={errors.image} />
            </label>
            {imagePreview && (
              <div className="grid grid-cols-2 gap-2 tablet:grid-cols-3 desktop:grid-cols-5 desktop:gap-5">
                {getPreviewImg()}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Title title="옷 정보" />
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-violet-700">
                체크하면 옷 정보 입력란이 추가됩니다
              </span>
              <input
                {...register("fashion-info")}
                type="checkbox"
                checked={isChecked}
                onClick={checkHandler}
              />
            </div>
          </div>
          {isChecked && (
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center space-x-4">
                <span className="text-sm font-semibold">상의</span>
                <div className="space-x-1">
                  <input
                    name="top_brand"
                    placeholder="브랜드명"
                    {...register("top_brand")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <input
                    name="top_name"
                    placeholder="제품명"
                    {...register("top_name")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <select
                    name="top_size"
                    {...register("top_size")}
                    className="bg-transparent text-xs focus:outline-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <span className="text-sm font-semibold">하의</span>
                <div className="space-x-1">
                  <input
                    name="top_brand"
                    placeholder="브랜드명"
                    {...register("pants_brand")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <input
                    name="top_name"
                    placeholder="제품명"
                    {...register("pants_name")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <select
                    name="top_size"
                    {...register("pants_size")}
                    className="bg-transparent text-xs focus:outline-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center space-x-4">
                <span className="text-sm font-semibold">신발</span>
                <div className="space-x-1">
                  <input
                    name="shoes_brand"
                    placeholder="브랜드명"
                    {...register("shoes_brand")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <input
                    name="shoes_name"
                    placeholder="제품명"
                    {...register("shoes_name")}
                    className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                  />
                  <select
                    name="shoes_size"
                    {...register("shoes_size")}
                    className="bg-transparent text-xs focus:outline-none"
                  >
                    <option value="240">240</option>
                    <option value="250">250</option>
                    <option value="260">260</option>
                    <option value="270">270</option>
                    <option value="280">280</option>
                  </select>
                </div>
              </div>
              {isAdded && (
                <div className="flex justify-between items-center space-x-4">
                  <span className="text-sm font-semibold">아우터</span>
                  <div className="space-x-1">
                    <input
                      name="outer_brand"
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                      placeholder="브랜드명"
                      {...register("outer_brand")}
                    />
                    <input
                      name="outer_name"
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                      placeholder="제품명"
                      {...register("outer_name")}
                    />
                    <select
                      name="outer_size"
                      {...register("outer_size")}
                      className="bg-transparent text-xs focus:outline-none"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                </div>
              )}
              {!isAdded && (
                <button onClick={infoAddHandler}>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="px-4 py-4 flex flex-col space-y-4 border-2 border-black rounded-md">
          <Title title="📌 상위 게시물로 등록하시겠습니까?" />
          <div className="px-4 flex flex-col space-y-1 text-sm font-semibold">
            <span>등록 시 메인 페이지 상단 게시물에 업로드 되며</span>
            <span>일정 포인트(NODE)가 소모됩니다.</span>
          </div>
          <div className="px-4 space-x-2">
            <label className="text-sm font-semibold text-green-500">네</label>
            <input
              {...register("upstream", { required: true })}
              type="radio"
              value="true"
            />
          </div>
          <div className="px-4 space-x-2">
            <label className="text-sm font-semibold text-red-500">아니요</label>
            <input
              {...register("upstream", { required: true })}
              type="radio"
              value="false"
            />
          </div>
        </div>
        <Button message="작성" />
      </form>
    </motion.div>
  );
}

export { WritePost };
