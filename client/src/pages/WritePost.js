import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

//📌 to do
//1. formData append 데이터 싹 정리해놓기
//2. 작성한 data를 redux로 관리할것인지?
//3. 사진 누르면 배열에서 요소 삭제하기
//4. UI 개선하기
//5. image 최소 3장, 최대 5장
//6. 유효성 검사(최소 내용 글자 수, fashion info)

function WritePost() {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [isChecked, setIsChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const multipleImages = watch("image");
  const imgRef = useRef(null);

  useEffect(() => {
    if (multipleImages) {
      const previewM = Object.values(multipleImages).map(a => {
        return URL.createObjectURL(a);
      });
      setImagePreview(previewM);
    }
  }, [multipleImages]);

  const removeImageHandler = e => {
    console.log(e.target);
    const multipleImgArr = Object.values(multipleImages);
    if (multipleImages) {
      const newMultipleImages = multipleImgArr.filter(item => {
        //모르겠다...
      });
      console.log(newMultipleImages);
    }
  };

  const render = data => {
    return data.map((image, i) => {
      return (
        <div className="relative mt-2 mx-2 w-44 h-44 flex justify-center">
          <img
            name={i}
            className="flex drop-shadow-md"
            src={image}
            alt=""
            key={image}
            onClick={removeImageHandler}
          />
          <div className="absolute text-white text-center w-full h-full bottom-0 bg-black opacity-0 hover:h-full hover:opacity-50 duration-500 cursor-pointer">
            <div className="self-center justify-center w-full h-full">
              삭제하기
            </div>
          </div>
        </div>
      );
    });
  };

  const checkHandler = e => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      alert("체크하시면 토큰을 10만큼 더 수령합니다. 정성껏 작성해주세요.");
    }
  };

  const infoAddHandler = e => {
    setIsAdded(true);
  };

  const onValid = data => {
    try {
      const formData = new FormData();
      const { title, contents, category, upstream } = data;

      const image_1 = data.image[0];
      const image_2 = data.image[1];
      const image_3 = data.image[2];
      const image_4 = data.image[3];
      const image_5 = data.image[4];

      formData.append("title", title);
      formData.append("content", contents);
      formData.append("category", category);
      formData.append("upstream", upstream);
      formData.append("image", image_1);
      formData.append("image", image_2);
      formData.append("image", image_3);
      formData.append("image", image_4);
      formData.append("image", image_5);
      console.log(1);
      axios
        .post("http://localhost:8000/posts/board", formData)
        .then(result => {
          console.log(result);
          navigate("/");
        })
        .catch(e => {
          console.log(e);
          alert(e.response.data.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  console.log(watch("image"));

  if (!isLoggedIn) {
    alert("로그인 후 이용해주세요.");
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
                    <label className="flex flex-col mt-2 space-y-2 justify-center items-center w-44 h-44 bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 cursor-pointer">
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
                        {multipleImages ? (
                          <div>{multipleImages.length} / 5</div>
                        ) : (
                          <div></div>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        {...register(
                          "image",
                          {
                            required: "이미지를 업로드해주세요",
                          },
                          { shouldFocus: true }
                        )}
                      />
                      <span className="text-xs text-red-500 font-semibold">
                        {errors?.image?.message}
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="flex flex-row">
                        {render(imagePreview)}
                      </div>
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
                          name="bottom_brand"
                          className="border-2 border-black rounded-md"
                          placeholder="브랜드명"
                          {...register("bottom_brand", { required: false })}
                        ></input>
                        <input
                          name="bottom_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          {...register("bottom_name", { required: false })}
                        ></input>
                        <select
                          name="bottom_size"
                          {...register("bottom_size", { required: false })}
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
