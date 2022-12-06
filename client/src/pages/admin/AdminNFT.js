import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { NFTStorage } from "nft.storage";
import axios from "axios";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";

const APIKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEEzNjMyMDE4ZjQzNkM1MzMxODlFOTUwNThBMjhBRThBZTUxYjc1QTkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjcwOTI4NTcyMywibmFtZSI6ImppbnNlb24ifQ.IMJLo0kKmPGHsfbjg79ii4u2i-2kR7-CenrDy17lXJM";

function AdminNFT() {
  //🟠redux 관리자 정보
  const adminInfo = useSelector(state => state.admin);
  const isAdmin = adminInfo.isAdmin;
  const navigate = useNavigate();

  //🟠react-hook-form 라이브러리 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //🟠이미지 input 값 상태관리
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState();

  //🟠로딩 상태관리
  const [loading, setLoading] = useState(false);

  //🟠이미지 업로드 함수(onChange)
  const uploadImageHandler = e => {
    let reader = new FileReader();
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = () => {
        const previewImgUrl = reader.result;
        if (previewImgUrl) {
          setImagePreview(previewImgUrl);
        }
      };
    }
  };

  //🟠이미지 삭제 함수
  const removeImageHandler = () => {
    setImage();
    setImagePreview("");
  };

  //🟠onSubmit 시에 데이터 유효하면 실행되는 함수
  const onValid = async data => {
    console.log(data);
    setLoading(true);
    try {
      const { name, description } = data;

      const nftStorage = {
        image: image,
        name: name,
        description: description,
      };

      const client = new NFTStorage({ token: APIKey });
      console.log(client);
      const nftMetadata = await client.store(nftStorage);
      console.log(nftMetadata);
      const metadataUrl = `https://ipfs.io/ipfs/${nftMetadata.data.image.pathname}`;
      console.log(metadataUrl);
      console.log("NFT data stored!");

      const formData = new FormData();
      formData.append("nft_image", image);
      formData.append("title", name);
      formData.append("description", description);
      formData.append("metadataUrl", metadataUrl);

      axios
        .post("http://localhost:8000/admin/nftmint", formData, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          setLoading(false);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
          // navigate(-1);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
          Swal.fire({
            icon: "info",
            text: "업로드에 실패했습니다.",
          });
        });
    } catch (e) {
      setLoading(false);
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
      <div className="mt-40 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center font-title">
          NFT 발행하기
        </h1>
        <div className="mt-4 w-3/5">
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="mt-8 grid gird-cols2">
                {/* 🟠 이미지 파일 */}
                <label className="text-xl font-bold text-start font-title">
                  NFT 이미지 업로드
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
                <div className="grid gird-cols2 mt-8">
                  <label className="text-xl font-bold space-y-2 text-start font-title">
                    NFT 이름
                  </label>
                  <input
                    {...register("name", {
                      required: "NFT 이름을 입력해주세요.",
                    })}
                    type="text"
                    placeholder="NFT 이름을 입력해주세요."
                    className="border-2 border-black mt-2 rounded-md"
                  />
                </div>
                <div className="text-xs text-red-500 font-semibold">
                  {errors?.name?.message}
                </div>
                <div className="grid gird-cols2 mt-8">
                  <label className="text-xl font-bold space-y-2 text-start font-title">
                    NFT description
                  </label>
                  <textarea
                    {...register("description")}
                    type="text"
                    placeholder="NFT 내용을 설명해주세요."
                    className="border-2 border-black mt-2 rounded-md"
                  />
                </div>
                <div className="text-xs text-red-500 font-semibold">
                  {errors?.description?.message}
                </div>
                {/* <div className="grid gird-cols2 mt-8">
                  <label className="text-xl font-bold space-y-2 text-start font-title">
                    NFT attributes
                  </label>
                  <input
                    {...register("attribute", {
                      required: "속성값을 json 형식으로 입력해주세요.",
                    })}
                    type="text"
                    placeholder="속성값을 json 형식으로 입력해주세요."
                    className="border-2 border-black mt-2 rounded-md"
                  />
                </div>
                <div className="text-xs text-red-500 font-semibold">
                  {errors?.attribute?.message}
                </div> */}
              </div>

              <div className="mt-8 grid gird-cols2"></div>
              <button
                type="submit"
                className="my-8 py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title"
              >
                작성 완료
              </button>
              <div className="h-20" />
            </form>
          </div>
        </div>
        {loading && (
          <div className="fixed self-center">
            <HashLoader className="w-1/3 " color={"#36d7b7"} />
          </div>
        )}
      </div>
    );
  }
}

export { AdminNFT };
