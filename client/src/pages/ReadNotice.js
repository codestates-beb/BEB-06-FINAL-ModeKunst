import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ReadNotice() {
  const { noticeId } = useParams();

  //🟠redux 관리자 정보
  const userInfo = useSelector(state => state.user);
  const { isAdmin, nickname: adminNickname } = useSelector(
    state => state.admin
  );

  //🟠공지 상태관리
  const [notice, setNotice] = useState({});
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  var imageList = [];

  const navigate = useNavigate();

  // 공지 및 래플 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/admin/notice/${noticeId}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.data;
        console.log(data);
        setContent(data.content);
        setTitle(data.title);
        setTokenPrice(data.token_price);
        setNotice(data);
      })
      .catch(e => {
        console.log(e);
      });
  }, [noticeId]);

  // 사진 슬라이드 세팅
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  imageList = [
    notice.image_1,
    notice.image_2,
    notice.image_3,
    notice.image_4,
    notice.image_5,
  ].filter(item => {
    if (item) return item;
  });

  console.log(imageList);

  const removeNoticeHandler = async () => {
    axios
      .delete(`http://localhost:8000/admin/notice/${noticeId}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data;
        Swal.fire({
          icon: "success",
          text: `${data.message}`,
        });
        navigate("/admin");
      })
      .catch(e => {
        console.log(e);
        Swal.fire({
          icon: "info",
          text: "삭제할 수 없습니다.",
        });
      });
  };

  return (
    <div className="h-full mt-32 mx-auto flex flex-col items-center max-w-[1000px]">
      <div className="flex flex-col w-4/5 space-y-5  items-center text-center p-10 bg-slate-50 rounded-xl border border-black shadow-xl">
        <div className="text-2xl font-title text-center">
          {tokenPrice ? "[래플]" : "[공지]"}
          {title}
        </div>
        {imageList ? (
          <Slider {...settings} className="h-full">
            {imageList.map((item, idx) => (
              <img key={idx} alt="notice_images" src={item} />
            ))}
          </Slider>
        ) : (
          ""
        )}
        <div className="text-start font-content">{content}</div>
        {tokenPrice ? (
          <div className="font-bold font-title">
            필요한 MODE 토큰: {tokenPrice}
          </div>
        ) : (
          ""
        )}
      </div>

      {isAdmin ? (
        <div className="flex flex-row space-x-5">
          <div className="mt-5">
            <Link to={`/notice/${parseInt(noticeId) - 1}`}>
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 space-x-2">
            <button className="font-title bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500">
              <Link to={`/reset/notice/${noticeId}`}>수정하기</Link>
            </button>
            <button className="font-title bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500">
              <Link to="/notice">목록으로</Link>
            </button>
            <button
              onClick={removeNoticeHandler}
              className="font-title bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500"
            >
              삭제하기
            </button>
          </div>
          <div className="mt-5">
            <Link to={`/notice/${parseInt(noticeId) + 1}`}>
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-5">
            <Link to={`/notice/${parseInt(noticeId) - 1}`}>
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Link>
          </div>
          <button className="font-title bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500">
            <Link to="/notice">목록으로</Link>
          </button>
          <div className="mt-5">
            <Link to={`/notice/${parseInt(noticeId) + 1}`}>
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
      <div className="mb-40" />
    </div>
  );
}

export { ReadNotice };
