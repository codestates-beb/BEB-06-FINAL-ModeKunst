import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FormHeader } from "../components/form/FormHeader";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, ErrorMessage, Input, Title } from "../components/form";

function ResetPost() {
  const { id } = useParams();
  const { userInfo: loggedInUser, isLoggedIn } = useSelector(
    state => state.user
  );

  const [post, setPost] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [names, setNames] = useState("");

  const navigate = useNavigate();
  let fileList = [];
  let fileName1;
  let fileName2;
  let fileName3;
  let fileName4;
  let fileName5;

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        console.log(data);
        setPost(data.post);
        setBrand(data.post.Product_brand);
        setSize(data.post.Product_size);
        setNames(data.post.Product_name);
      })
      .catch(e => {
        console.log(e);
      });
  }, [id]);

  useEffect(() => {
    console.log(brand?.top);
    if (brand?.top) {
      setIsChecked(true);
    }
  });

  //image 가져오면 file 객체의 배열로 만들어줌
  useEffect(() => {
    const imageList = [
      post.image_1,
      post.image_2,
      post.image_3,
      post?.image_4,
      post?.image_5,
    ].filter(item => {
      if (item) return item;
    });

    if (imageList.length) {
      setImagePreview(imageList);
      const convert = async () => {
        fileName1 = await convertURLtoBLOB(imageList[0]);

        fileName2 = await convertURLtoBLOB(imageList[1]);

        fileName3 = await convertURLtoBLOB(imageList[2]);

        if (imageList[3]) {
          fileName4 = await convertURLtoBLOB(imageList[3]);
        }
        if (imageList[4]) {
          fileName5 = await convertURLtoBLOB(imageList[4]);
        }

        fileList = [
          fileName1,
          fileName2,
          fileName3,
          fileName4,
          fileName5,
        ].filter(item => {
          if (item) return item;
        });
        setMultipleImages(fileList);
      };
      convert();
    }
  }, [post]);

  const convertURLtoBLOB = async url => {
    const blob = await fetch(url).then(result => result.blob());
    const ext = await url.split(".").pop(); // url 구조에 맞게 수정할 것
    console.log(ext);
    const filename = await url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([blob], filename, metadata);
  };

  // 이미지 업로드 함수(onChange)
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
    if (multipleImages?.length < 3) {
      Swal.fire({
        icon: "info",
        text: "사진은 3장 이상 업로드해주세요.",
      });
    } else {
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
        console.log(multipleImages[0]);

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

        console.log(formData);

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
              icon: "info",
              text: `${e.response.data.message}`,
            });
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (!isLoggedIn && post.userNickname === loggedInUser.nickname) {
    Swal.fire({
      icon: "warning",
      text: "로그인 후 이용해주세요.",
    }).then(() => navigate("/login"));
  } else {
    return (
      <div className="w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
        <FormHeader title="포스트 수정" />
        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full space-y-8 tablet:w-3/5 desktop:w-1/2"
        >
          <div className="flex flex-col space-y-2">
            <Title title="제목" />
            <Input
              register={register}
              id="title"
              defaultValue={post.title}
              type="text"
              message="제목"
            />
            <ErrorMessage error={errors.title} />
          </div>
          <div className="flex flex-col space-y-2">
            <Title title="내용" />
            <textarea
              {...register("contents", {
                required: "내용을 입력해주세요.",
              })}
              type="text"
              defaultValue={post.content}
              placeholder="내용을 입력해주세요."
              className="px-4 py-2 text-sm bg-transparent border-2 border-black rounded-md focus:outline-none focus:border-[3px]"
            />
            <ErrorMessage error={errors.contents} />
          </div>
          <div className="flex flex-col space-y-4">
            <Title title="카테고리" />
            <select
              defaultValue={post.category}
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
                  {multipleImages ? (
                    <div>{multipleImages.length} / 5</div>
                  ) : null}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadImageHandler}
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
                  onClick={checkHandler}
                  checked={isChecked}
                  defaultValue={isChecked}
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
                      defaultValue={brand?.top}
                      {...register("top_brand")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <input
                      name="top_name"
                      placeholder="제품명"
                      defaultValue={names?.top}
                      {...register("top_name")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <select
                      name="top_size"
                      defaultValue={size?.top}
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
                      name="pants_brand"
                      placeholder="브랜드명"
                      defaultValue={brand?.pants}
                      {...register("pants_brand")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <input
                      name="pants_name"
                      placeholder="제품명"
                      defaultValue={names?.pants}
                      {...register("pants_name")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <select
                      name="pants_size"
                      defaultValue={size?.pants}
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
                      defaultValue={brand?.shoes}
                      {...register("shoes_brand")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <input
                      name="shoes_name"
                      placeholder="제품명"
                      defaultValue={names?.shoes}
                      {...register("shoes_name")}
                      className="px-2 py-1 border-b-2 border-b-black bg-transparent placeholder:text-xs placeholder:text-yellow-500 focus:outline-none focus:border-b-[3px]"
                    />
                    <select
                      name="shoes_size"
                      defaultValue={size?.shoes}
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

                {/* brand.outer 에러 수정 필요: undefined */}
                {/* <div onClick={infoAddHandler}>
                    {(isAdded || brand?.outer) && (
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
                          {...register("outer_name")}
                        ></input>
                        <select
                          name="outer_size"
                          defaultValue={size.outer}
                          {...register("outer_size")}
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
                  </div> */}
              </div>
            )}
          </div>
          <Button message="수정" />
        </form>
      </div>
    );
  }
}

export { ResetPost };
