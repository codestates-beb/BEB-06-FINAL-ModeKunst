import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

import Swal from "sweetalert2";

function ResetNotice() {
  //🟠redux 관리자 정보
  const { noticeId } = useParams();
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;
  const navigate = useNavigate();

  //🟠공지 상태관리
  const [notice, setNotice] = useState({});
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);

  //🟠이미지 input 값 상태관리
  const [imagePreview, setImagePreview] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  var imageList = [];

  var fileList = [];
  var fileName1;
  var fileName2;
  var fileName3;
  var fileName4;
  var fileName5;

  //🟠react-hook-form 라이브러리 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // 🟠유저페이지 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/admin/notice/${noticeId}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.data;
        console.log(data);
        setNotice(data);
        setContent(data.content);
        setTitle(data.title);
        setTokenPrice(data.token_price);
      })
      .catch(e => {
        console.log(e);
      });
  }, [noticeId]);

  //🟠image 가져오면 file 객체의 배열로 만들어줌
  useEffect(() => {
    imageList = [
      notice.image_1,
      notice.image_2,
      notice.image_3,
      notice.image_4,
      notice.image_5,
    ].filter(item => {
      if (item) return item;
    });

    if (imageList) {
      console.log(imageList);
      setImagePreview(imageList);
      const convert = async () => {
        fileName1 = await convertURLtoBLOB(imageList[0]);

        if (imageList[1]) {
          fileName2 = await convertURLtoBLOB(imageList[1]);
        }

        if (imageList[2]) {
          fileName3 = await convertURLtoBLOB(imageList[2]);
        }

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
      console.log(multipleImages);
    }
  }, [notice]);

  const convertURLtoBLOB = async url => {
    const blob = await fetch(url).then(result => result.blob());
    const ext = await url.split(".").pop(); // url 구조에 맞게 수정할 것
    const filename = await url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([blob], filename, metadata);
  };

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
    try {
      const formData = new FormData();
      const { title, contents, token_price } = data;
      console.log(multipleImages);
      const image_1 = multipleImages[0];
      const image_2 = multipleImages[1];
      const image_3 = multipleImages[2];
      const image_4 = multipleImages[3];
      const image_5 = multipleImages[4];

      formData.append("title", title);
      formData.append("content", contents);
      formData.append("token_price", token_price);
      formData.append("notice_image", image_1);
      formData.append("notice_image", image_2);
      formData.append("notice_image", image_3);
      formData.append("notice_image", image_4);
      formData.append("notice_image", image_5);

      axios
        .put(`http://localhost:8000/admin/notice/${noticeId}`, formData, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          console.log(data);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
          navigate(`/notice/${noticeId}`);
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
      <div className="mt-48 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center font-title">
          공지 / 래플 수정
        </h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="grid gird-cols2">
                <label className="text-xl font-bold text-start font-title">
                  제목
                </label>
                <input
                  {...register("title")}
                  type="text"
                  defaultValue={title}
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
                  {...register("contents")}
                  type="text"
                  defaultValue={content}
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
                  {...register("token_price")}
                  type="token_price"
                  defaultValue="0"
                  className="border-2 border-black rounded-md"
                />
              </div>
              <div className="text-xs text-red-500 font-semibold">
                {errors?.token_price?.message}
              </div>
              <button
                type="submit"
                className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md"
              >
                수정 완료
              </button>
              <div className="h-20" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export { ResetNotice };
