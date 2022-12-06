import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BannerList() {
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [clicked3, setClicked3] = useState(false);
  const [clicked4, setClicked4] = useState(false);

  const [banner1, setBanner1] = useState({});
  const [banner2, setBanner2] = useState({});
  const [banner3, setBanner3] = useState({});
  const [banner4, setBanner4] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/banner", {
        withCredentials: true,
      })
      .then(result => {
        const data = Object.values(result.data)[0];
        console.log(data[0]);
        setBanner1(data[0]);
        setBanner2(data[1]);
        setBanner3(data[2]);
        setBanner4(data[3]);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div className="h-full flex flex-col space-y-5 items-center">
      <h1 className="mt-40 font-title text-center text-2xl">
        현재 게시 중인 배너
      </h1>

      <div className="w-3/4 px-4 py-8 bg-white rounded-md space-y-4 drop-shadow-md">
        <div className="font-title text-lg font-bold">배너 1</div>
        <div
          onClick={() => {
            setClicked1(!clicked1);
          }}
        >
          {banner1 ? (
            <img
              className="cursor-pointer rounded-md"
              src={banner1.image}
              alt="banner1"
            />
          ) : (
            <div className="w-full flex flex-col py-10 items-center bg-slate-300 rounded-md drop-shadow-sm cursor-pointer">
              등록된 배너가 없습니다.
              <div className="text-xs font-content text-slate-500">
                클릭하여 배너를 등록해주세요.
              </div>
            </div>
          )}
        </div>
        {clicked1 && (
          <div>
            {!banner1 ? (
              <Link to="/admin/writebanner">
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  배너 등록하기
                </button>
              </Link>
            ) : (
              <Link to={`/admin/resetbanner/${banner1.id}`}>
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  수정
                </button>
              </Link>
            )}
          </div>
        )}

        <div className="font-title text-lg font-bold">배너 2</div>
        <div
          onClick={() => {
            setClicked2(!clicked2);
          }}
        >
          {banner2 ? (
            <img
              className="cursor-pointer rounded-md"
              src={banner2.image}
              alt="banner2"
            />
          ) : (
            <div className="w-full flex flex-col py-10 items-center bg-slate-300 rounded-md drop-shadow-sm cursor-pointer">
              등록된 배너가 없습니다.
              <div className="text-xs font-content text-slate-500">
                클릭하여 배너를 등록해주세요.
              </div>
            </div>
          )}
        </div>
        {clicked2 && (
          <div>
            {!banner2 ? (
              <Link to="/admin/writebanner">
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  배너 등록하기
                </button>
              </Link>
            ) : (
              <Link to={`/admin/resetbanner/${banner2.id}`}>
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  수정
                </button>
              </Link>
            )}
          </div>
        )}

        <div className="font-title text-lg font-bold">배너 3</div>
        <div
          onClick={() => {
            setClicked3(!clicked3);
          }}
        >
          {banner3 ? (
            <img
              className="cursor-pointer rounded-md"
              src={banner3.image}
              alt="banner1"
            />
          ) : (
            <div className="w-full flex flex-col py-10 items-center bg-slate-300 rounded-md drop-shadow-sm cursor-pointer">
              등록된 배너가 없습니다.
              <div className="text-xs font-content text-slate-500">
                클릭하여 배너를 등록해주세요.
              </div>
            </div>
          )}
        </div>
        {clicked3 && (
          <div>
            {!banner3 ? (
              <Link to="/admin/writebanner">
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  배너 등록하기
                </button>
              </Link>
            ) : (
              <Link to={`/admin/resetbanner/${banner3.id}`}>
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  수정
                </button>
              </Link>
            )}
          </div>
        )}

        <div className="font-title text-lg font-bold">배너 4</div>
        <div
          onClick={() => {
            setClicked4(!clicked4);
          }}
        >
          {banner4 ? (
            <img
              className="cursor-pointer rounded-md"
              src={banner4.image}
              alt="banner4"
            />
          ) : (
            <div className="w-full flex flex-col py-10 items-center bg-slate-300 rounded-md drop-shadow-sm cursor-pointer">
              등록된 배너가 없습니다.
              <div className="text-xs font-content text-slate-500">
                클릭하여 배너를 등록해주세요.
              </div>
            </div>
          )}
        </div>
        {clicked4 && (
          <div>
            {!banner4 ? (
              <Link to="/admin/writebanner">
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  배너 등록하기
                </button>
              </Link>
            ) : (
              <Link to={`/admin/resetbanner/${banner4.id}`}>
                <button className="py-1 border-b bg-black w-full text-white font-medium text-l rounded-md font-title">
                  수정
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="mb-64" />
    </div>
  );
}

export { BannerList };
