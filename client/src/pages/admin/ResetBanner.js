import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";

import Swal from "sweetalert2";

function ResetBanner() {
  const { bannerId } = useParams();

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

  //🟠상태관리
  const [imagePreview, setImagePreview] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [banner, setBanner] = useState();
  let bannerFile;

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/banner", {
        withCredentials: true,
      })
      .then(result => {
        const data = Object.values(result.data)[0];
        console.log(data);
        setBanner(data.filter(data => data.id == bannerId));
      })
      .catch(e => {
        console.log(e);
      });
  }, [bannerId]);

  useEffect(() => {
    if (banner) {
      console.log(banner[0]);
      setImagePreview(banner[0].image);
      setBannerUrl(banner[0].url);

      const convert = async () => {
        bannerFile = await convertURLtoBLOB(banner[0].image);
        setBannerImage(bannerFile);
      };
      convert();
    }
  }, [banner]);

  const convertURLtoBLOB = async url => {
    const blob = await fetch(url).then(result => result.blob());
    const ext = await url.split(".").pop(); // url 구조에 맞게 수정할 것
    console.log(ext);
    const filename = await url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([blob], filename, metadata);
  };

  //🟠이미지 업로드 함수(onChange)
  const uploadImageHandler = e => {
    let reader = new FileReader();
    if (e.target.files[0]) {
      setBannerImage(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = () => {
        console.log(reader);
        console.log(reader.result);
        const previewImgUrl = reader.result;
        if (previewImgUrl) {
          setImagePreview(previewImgUrl);
        }
      };
    }
  };

  //🟠이미지 삭제 함수
  const removeImageHandler = () => {
    setBannerImage();
    setImagePreview("");
  };

  //🟠banner 삭제함수
  const RemoveBannerHandler = async () => {
    axios
      .delete(`http://localhost:8000/admin/banner/${bannerId}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data;
        Swal.fire({
          icon: "success",
          text: `${data.message}`,
        });
        navigate(-1);
      })
      .catch(e => {
        console.log(e);
        Swal.fire({
          icon: "info",
          text: "삭제할 수 없습니다.",
        });
      });
  };

  //🟠onSubmit 시에 데이터 유효하면 실행되는 함수
  const onValid = data => {
    console.log(data);
    try {
      const formData = new FormData();
      const { url } = data;

      formData.append("banner_url", url);
      formData.append("banner_image", bannerImage);

      axios
        .put(`http://localhost:8000/admin/banner/${bannerId}`, formData, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          console.log(formData);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
          navigate(-1);
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
      text: "페이지 접근 권한이 없습니다.",
    });
    navigate("/adminlogin");
  } else if (isAdmin) {
    return (
      <div className="mt-64 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center font-title">
          배너 수정하기
        </h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="mt-8 grid gird-cols2">
                {/* 🟠 이미지 파일 */}
                <label className="text-xl font-bold text-start font-title">
                  배너 이미지 업로드
                </label>
                {!imagePreview ? (
                  <div className="flex flex-wrap items-center justify-center">
                    <label className="flex flex-col mt-2 space-y-2 justify-center items-center w-80 h-40 bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer">
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
                      <span className="text-xs font-semibold text-slate-800"></span>
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
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center">
                    <div className="flex">
                      <label className="flex flex-col mt-2 space-y-2 justify-center items-center w-full bg-slate border-2 border-dashed border-slate-300 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer">
                        <img src={imagePreview} alt="preview" />
                      </label>
                      <button onClick={() => removeImageHandler()}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="black"
                          className="w-6 h-6 absolute self-end drop-shadow-lg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <div className="grid gird-cols2 mt-16">
                  <label className="text-xl font-bold space-y-2 text-start font-title">
                    이벤트 URL 입력
                  </label>
                  <input
                    {...register("url", {
                      required: "이벤트 url을 입력해주세요.",
                    })}
                    type="text"
                    defaultValue={bannerUrl}
                    placeholder="url을 입력해주세요."
                    className="border-2 border-black mt-2 rounded-md"
                  />
                </div>
                <div className="text-xs text-red-500 font-semibold">
                  {errors?.url?.message}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 space-x-4">
                <button
                  type="submit"
                  className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title"
                >
                  수정 완료
                </button>
                <button
                  onClick={RemoveBannerHandler}
                  className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title"
                >
                  배너 삭제
                </button>
              </div>
              <div className="h-32" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export { ResetBanner };
