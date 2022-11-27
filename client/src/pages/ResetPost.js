import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

import Swal from "sweetalert2";

//📌 to do
// 1. 받아온 이미지 데이터가 blob 객체임 file 객체가 필요함
// 2. upstream 값을 받아와야 함 - 이미 toppost 인 경우 처리 필요
// 3. 수정한 데이터를 완전히 갈아끼우는 형식이 될 거 같음

function ResetPost() {
  const { id } = useParams();
  const userInfo = useSelector(state => state.user);

  const [post, setPost] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [names, setNames] = useState("");

  const isLoggedIn = userInfo.isLoggedIn;
  const navigate = useNavigate();
  let fileList = [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [isChecked, setIsChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const [multipleImages, setMultipleImages] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/updatePost/${id}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.data;
        setPost(data.post);
        setBrand(data.post.Product_brand);
        setSize(data.post.Product_size);
        setNames(data.post.Product_name);
      })
      .catch(e => {
        console.log(e);
      });
  }, [navigate]);

  useEffect(() => {
    if (brand?.top) {
      setIsChecked(true);
    }
  });

  const imageList = [
    post.image_1,
    post.image_2,
    post.image_3,
    post?.image_4,
    post?.image_5,
  ].filter(item => {
    if (item) return item;
  });

  //image 가져오면 file 객체의 배열로 만들어줌
  useEffect(() => {
    if (imageList) {
      setImagePreview(imageList);

      var image_1 = new File([imageList[0]], "image");
      var image_2 = new File([imageList[0]], "image");
      var image_3 = new File([imageList[0]], "image");
      if (imageList[3]) {
        var image_4 = new File([imageList[0]], "image");
        if (imageList[4]) {
          var image_5 = new File([imageList[0]], "image");
        }
      }

      fileList = [image_1, image_2, image_3, image_4, image_5].filter(item => {
        if (item) return item;
      });
    }
  }, [imageList[0]]);

  useEffect(() => {
    if (fileList) {
      setMultipleImages(fileList);
    }
  }, [fileList[0]]);

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
    console.log(data);
    try {
      const formData = new FormData();
      const {
        title,
        contents,
        category,
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

      const image_1 = multipleImages[0];
      const image_2 = multipleImages[1];
      const image_3 = multipleImages[2];
      const image_4 = multipleImages[3];
      const image_5 = multipleImages[4];

      formData.append("title", title);
      formData.append("content", contents);
      formData.append("category", category);
      formData.append("haveInfo", isChecked);
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
        .put(`http://localhost:8000/posts/${id}`, formData)
        .then(result => {
          const data = result.data;
          console.log(data);
          Swal.fire({
            icon: "success",
            text: `${result.data.message}`,
          }).then(() => navigate(`/post/${data.data.postId}`));
        })
        .catch(e => {
          console.log(e);
          Swal.fire({
            icon: "failure",
            text: `${e.response.data.message}`,
          });
        });
    } catch (e) {
      console.log(e);
    }
  };

  if (!isLoggedIn && post.userNickname === userInfo.userInfo.nickname) {
    alert("로그인 후 이용해주세요.");
    navigate("/");
  } else {
    return (
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">수정하기</h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="grid gird-cols2">
                <label className="text-xl font-bold text-start">title</label>
                <input
                  {...register("title", { required: "제목을 입력해주세요." })}
                  defaultValue={post.title}
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
                  defaultValue={post.content}
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
                  defaultValue={post.category}
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
                    <label className="flex flex-col mt-2 space-y-2 justify-center items-center w-44 h-44 bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 cursor-pointer rounded-md">
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
                      <div className="flex flex-row">{getPrveiwImg()}</div>
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
                    defaultValue={isChecked}
                  />
                  {isChecked && (
                    <div>
                      <div>
                        <span>상의</span>
                        <input
                          name="top_brand"
                          className="border-2 border-black rounded-md"
                          placeholder="브랜드명"
                          defaultValue={brand.top}
                          {...register("top_brand", { required: false })}
                        ></input>
                        <input
                          name="top_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          defaultValue={names.top}
                          {...register("top_name", { required: false })}
                        ></input>
                        <select
                          name="top_size"
                          defaultValue={size.top}
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
                          defaultValue={brand.pants}
                          {...register("pants_brand", { required: false })}
                        ></input>
                        <input
                          name="pants_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          defaultValue={names.pants}
                          {...register("pants_name", { required: false })}
                        ></input>
                        <select
                          name="pants_size"
                          defaultValue={size.pants}
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
                          defaultValue={brand.shoes}
                          {...register("shoes_brand", { required: false })}
                        ></input>
                        <input
                          name="shoes_name"
                          className="border-2 border-black rounded-md"
                          placeholder="제품명"
                          defaultValue={names.shoes}
                          {...register("shoes_name", { required: false })}
                        ></input>
                        <select
                          name="shoes_size"
                          defaultValue={size.shoes}
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
                        {/* 🟠brand.outer 에러 수정 필요: undefined */}
                        {(isAdded || brand.outer) && (
                          <div>
                            <span>아우터</span>
                            <input
                              name="outer_brand"
                              className="border-2 border-black rounded-md"
                              placeholder="브랜드명"
                              defaultValue={brand.outer}
                              {...register("outer_brand", {
                                required: false,
                              })}
                            ></input>
                            <input
                              name="outer_name"
                              className="border-2 border-black rounded-md"
                              placeholder="제품명"
                              defaultValue={names.outer}
                              {...register("outer_name", { required: false })}
                            ></input>
                            <select
                              name="outer_size"
                              defaultValue={size.outer}
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
              <button
                type="submit"
                className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md"
              >
                게시물 수정
              </button>
              <div className="h-20" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export { ResetPost };
