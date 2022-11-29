import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

import Swal from "sweetalert2";

function WriteNotice() {
  //🟠redux 관리자 정보
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;
  const navigate = useNavigate();

  //🟠react-hook-form 라이브러리 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  //🟠체크박스, 이미지 input 값 상태관리
  const [imagePreview, setImagePreview] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);

  //🟠이미지 업로드 함수(onChange)
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
        console.log(multipleImages);
      }
    }

    reader.onloadend = () => {
      console.log(reader);
      console.log(reader.result);
      const previewImgUrl = reader.result;
      if (previewImgUrl) {
        setImagePreview([...imagePreview, previewImgUrl]);
      }
    };
  };

  //🟠이미지 미리보기 함수
  const getPrveiwImg = () => {
    return multipleImages.map((image, index) => {
      return (
        <div
          key={index}
          className="relative mt-2 mx-2 w-44 h-44 flex justify-center"
        >
          <img
            className="flex drop-shadow-md rounded-md"
            src={imagePreview[index]}
            alt=""
            key={image}
          />
          <button onClick={() => removeImageHandler(index)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              className="w-6 h-6 absolute top-0 right-0 self-end drop-shadow-lg"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      );
    });
  };

  //🟠이미지 삭제 함수
  const removeImageHandler = index => {
    const imgArr = multipleImages.filter((el, i) => i !== index);
    const imgNameArr = imagePreview.filter((el, i) => i !== index);

    setMultipleImages([...imgArr]);
    setImagePreview([...imgNameArr]);
  };

  //🟠onSubmit 시에 데이터 유효하면 실행되는 함수
  const onValid = data => {
    console.log(data);
    if (multipleImages?.length < 3) {
      Swal.fire({
        icon: "info",
        text: "사진은 3장 이상 업로드해주세요.",
      });
    } else {
      try {
        const formData = new FormData();
        const { title, contents, top_brand } = data;

        console.log(top_brand);

        const image_1 = multipleImages[0];
        const image_2 = multipleImages[1];
        const image_3 = multipleImages[2];
        const image_4 = multipleImages[3];
        const image_5 = multipleImages[4];

        formData.append("title", title);
        formData.append("content", contents);
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
            console.log(formData);
            Swal.fire({
              icon: "success",
              text: `${data.message}`,
            });
            navigate(`/post/${data.data.postId}`);
          })
          .catch(e => {
            console.log(e);
            Swal.fire({
              icon: "info",
              text: "업로드에 실패했습니다.",
            });
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  //🟠마크업
  if (!isAdmin) {
    Swal.fire({
      icon: "info",
      text: "해당 페이지에 대한 접근 권한이 없습니다.",
    });
    navigate("/");
  } else {
    return (
      <div className="mt-64 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center font-title">
          공지 / 래플 작성
        </h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="grid gird-cols2">
                <label className="text-xl font-bold text-start font-title">
                  제목
                </label>
                <input
                  {...register("title", { required: "제목을 입력해주세요." })}
                  type="text"
                  placeholder="제목을 입력해주세요."
                  className="border-2 border-black rounded-md"
                />
              </div>
              <div className="text-xs text-red-500 font-semibold">
                {errors?.title?.message}
              </div>
              <div className="mt-8 grid gird-cols2">
                <label className="text-xl font-bold text-start font-title">
                  내용
                </label>
                <textarea
                  {...register("contents", {
                    required: "내용을 입력해주세요.",
                  })}
                  type="text"
                  placeholder="내용을 입력해주세요."
                  className="border-2 border-black rounded-md h-40"
                />
              </div>
              <div className="text-xs text-red-500 font-semibold">
                {errors?.contents?.message}
              </div>
              <div className="mt-8 grid gird-cols2">
                {/* 🟠 이미지 파일 */}
                <label className="text-xl font-bold text-start font-title">
                  사진 업로드
                </label>
                <div className="flex flex-wrap">
                  <div className="flex">
                    <label className="flex flex-col mt-2 space-y-2 justify-center items-center w-44 h-44 bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>

                      <span className="text-xs font-semibold text-slate-800">
                        {multipleImages ? (
                          <div>{multipleImages.length} / 5</div>
                        ) : (
                          <div></div>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={uploadImageHandler}
                        required
                      />
                      <span className="text-xs text-red-500 font-semibold">
                        {errors?.image?.message}
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="flex">{getPrveiwImg()}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid gird-cols2">
                <label className="text-xl font-bold text-start font-title">
                  필요한 MODE 토큰
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="토큰 양을 입력해주세요."
                  className="border-2 border-black rounded-md"
                />
              </div>
              <div className="text-xs text-red-500 font-semibold">
                {errors?.title?.message}
              </div>
              <button
                type="submit"
                className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md"
              >
                작성 완료
              </button>
              <div className="h-20" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export { WriteNotice };
