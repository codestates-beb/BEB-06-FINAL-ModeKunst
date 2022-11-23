import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

import Swal from "sweetalert2";

//📌 to do
//1. formData append 데이터 싹 정리해놓기 (v)
//2. 작성한 data를 redux로 관리할것인지?
//2-1. upstream = true 일 경우 fashion info 모든 값이 null 값이 아니어야됨
//3. 사진 누르면 배열에서 요소 삭제하기 (v)
//4. UI 개선하기
//5. image 최소 3장, 최대 5장(v)
//6. 유효성 검사(최소 내용 글자 수, fashion info)

function WritePost() {
  //🟠redux 유저 정보
  const userInfo = useSelector(state => state.user);
  const isLoggedIn = userInfo.isLoggedIn;
  const navigate = useNavigate();

  //🟠react-hook-form 라이브러리 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  //🟠체크박스, 이미지 input 값 상태관리
  const [isChecked, setIsChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
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

  //🟠fashion info 체크 함수
  const checkHandler = e => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      alert("체크하시면 토큰을 10만큼 더 수령합니다. 정성껏 작성해주세요.");
    }
  };

  //🟠아우터 정보 넣을지 말지
  const infoAddHandler = e => {
    setIsAdded(true);
  };

  //🟠onSubmit 시에 데이터 유효하면 실행되는 함수
  const onValid = data => {
    console.log(data);
    try {
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

      console.log(top_brand);

      const image_1 = multipleImages[0];
      const image_2 = multipleImages[1];
      const image_3 = multipleImages[2];
      const image_4 = multipleImages[3];
      const image_5 = multipleImages[4];



      formData.append("title", title);
      formData.append("content", contents);
      formData.append("category", category);
      formData.append('haveInfo', isChecked);
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
          console.log(formData);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
          // navigate(`/post/${data.data.postId}`);
        })
        .catch(e => {
          console.log(e);
          Swal.fire({
            icon: "failure",
            text: "업로드에 실패했습니다.",
          });
          alert(e.response.data.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  //🟠마크업
  if (!isLoggedIn) {
    Swal.fire({
      icon: "info",
      text: "로그인 후 이용해주세요.",
    });
    navigate("/");
  } else {
    return (
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">작성하기</h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="grid gird-cols2">
                <label className="text-xl font-bold text-start">title</label>
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
                <label className="text-xl font-bold text-start">contents</label>
                <textarea
                  {...register("contents", {
                    required: "내용을 입력해주세요.",
                  })}
                  type="text"
                  placeholder="내용을 입력해주세요."
                  className="border-2 border-black rounded-md"
                />
              </div>
              <div className="text-xs text-red-500 font-semibold">
                {errors?.contents?.message}
              </div>
              <div className="mt-8 grid gird-cols2">
                <label className="text-xl font-bold text-start">category</label>
                <select
                  defaultValue="casual"
                  {...register("category", {
                    required: "카테고리를 선택해주세요.",
                  })}
                  className="border-2 border-black rounded-md"
                >
                  <option value="casual">캐주얼</option>
                  <option value="dandy">댄디</option>
                  <option value="normcore">놈코어</option>
                  <option value="street">스트릿</option>
                </select>
              </div>
              <div className="mt-8 grid gird-cols2">
                {/* 🟠 이미지 파일 */}
                <label className="text-xl font-bold text-start">images</label>
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
                <div>
                  <label className="text-xl font-bold text-start">
                    fashion info
                  </label>
                  <input
                    {...register("fashion-info", { required: false })}
                    type="checkbox"
                    onClick={checkHandler}
                    checked={isChecked}
                  />
                  {isChecked && (
                    <div>
                      <div>
                        <span>상의</span>
                        <input
                          name="top_brand"
                          className="border-2 border-black rounded-md"
                          placeholder="브랜드명"
                          {...register("top_brand", { required: false })}
                        ></input>
                        <input
                          name="top_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          {...register("top_name", { required: false })}
                        ></input>
                        <select
                          name="top_size"
                          {...register("top_size", { required: false })}
                          className="border-2 border-black rounded-md"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                        *
                      </div>
                      <div>
                        <span>하의</span>
                        <input
                          name="pants_brand"
                          className="border-2 border-black rounded-md"
                          placeholder="브랜드명"
                          {...register("pants_brand", { required: false })}
                        ></input>
                        <input
                          name="pants_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          {...register("pants_name", { required: false })}
                        ></input>
                        <select
                          name="pants_size"
                          {...register("pants_size", { required: false })}
                          className="border-2 border-black rounded-md"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                        *
                      </div>
                      <div>
                        <span>신발</span>
                        <input
                          name="shoes_brand"
                          className="border-2 border-black rounded-md"
                          placeholder="브랜드명"
                          {...register("shoes_brand", { required: false })}
                        ></input>
                        <input
                          name="shoes_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          {...register("shoes_name", { required: false })}
                        ></input>
                        <select
                          name="shoes_size"
                          {...register("shoes_size", { required: false })}
                          className="border-2 border-black rounded-md"
                        >
                          <option value="230">230</option>
                          <option value="240">240</option>
                          <option value="250">250</option>
                          <option value="260">260</option>
                        </select>
                        *
                      </div>
                      <div onClick={infoAddHandler}>
                        {isAdded && (
                          <div>
                            <span>아우터</span>
                            <input
                              name="outer_brand"
                              className="border-2 border-black rounded-md"
                              placeholder="브랜드명"
                              {...register("outer_brand", { required: false })}
                            ></input>
                            <input
                              name="outer_name"
                              className="border-2 border-black rounded-md"
                              placeholder="제품명"
                              {...register("outer_name", { required: false })}
                            ></input>
                            <select
                              name="outer_size"
                              {...register("outer_size", { required: false })}
                              className="border-2 border-black rounded-md"
                            >
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                            </select>
                          </div>
                        )}
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
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  {!isChecked && <div></div>}
                </div>
              </div>
              <div>
                <div className="text-lg mt-8 font-bold">
                  상위 게시물에 등록하시겠습니까?
                </div>
                <div>등록 시 50토큰이 소요됩니다.</div>
                <span>네</span>
                <input
                  {...register("upstream", { required: true })}
                  type="radio"
                  value="true"
                />
                <span>아니요</span>
                <input
                  {...register("upstream", { required: true })}
                  type="radio"
                  value="false"
                />
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

export { WritePost };