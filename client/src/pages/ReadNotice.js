import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ReadNotice() {
  const { noticeId } = useParams();
  const reviewRef = useRef();
  const navigate = useNavigate();

  // redux 관리자 정보
  const { userInfo: loggedInUser, isLoggedIn } = useSelector(
    state => state.user
  );
  const { isAdmin, nickname: adminNickname } = useSelector(
    state => state.admin
  );

  // 공지 상태관리
  const [notice, setNotice] = useState({});
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  var imageList = [];

  //🟠리뷰 상태관리
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState("");
  const [myReview, setMyReview] = useState("");
  const [haveReview, setHaveReview] = useState(false);

  // 리뷰 수정 관련 state
  // isEditReview: 리뷰 수정 모드 ON/OFF & editTargetReview: 수정한 리뷰 내용
  const [isEditReview, setIsEditReview] = useState(false);
  const [editTargetReview, setEditTargetReview] = useState("");
  const [toggleReview, setToggleReview] = useState(false);

  // 리뷰 펼치기 및 접기 관련 state
  const STD_NUM = 4;
  const [std, setStd] = useState(1);
  const [modifiedReviews, setModifiedReviews] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

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

  // 유저페이지 리뷰 목록 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/noticecomment/${noticeId}`)
      .then(result => {
        if (std === 1) {
          setReviews(result.data.reviews);
          setIsLast(false);
        }
        if (std >= 2) setIsFirst(false);
        if (std === parseInt(reviews.length / STD_NUM) + 1) setIsLast(true);
        setModifiedReviews(result.data.reviews.slice(0, STD_NUM * std));
      });
  }, [std]);

  // 보여주는 리뷰 개수 변경
  // reviewsCount = 리뷰 작성, 삭제 했을 때 변경 & toggleReview = 리뷰 수정 시 변경
  useEffect(() => {
    setModifiedReviews(reviews.slice(0, STD_NUM * std));
  }, [reviewsCount, toggleReview]);

  // 리뷰 작성
  const sendReview = () => {
    axios
      .post(`http://localhost:8000/posts/noticecomment/${noticeId}`, {
        content: myReview,
      })
      .then(result => {
        const { reviews: newReviews, review_counts: newReviewsCount } =
          result.data.data;
        // 리뷰 작성 후에 reviews state 수정
        // post 요청으로 등록했기 때문에 새로고침해도 등록된 모든 리뷰를 불러옴
        console.log(newReviews);
        setReviews(newReviews);
        setReviewsCount(newReviewsCount);
        setHaveReview(true);
        reviewRef.current.value = "";
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          text: `${error.response.data.message}`,
        });
      });
  };

  // 리뷰 수정
  const editReview = () => {
    if (editTargetReview.length < 15) {
      Swal.fire({ icon: "warning", text: "리뷰는 15자 이상 작성해주세요." });
    } else {
      axios
        .put(`http://localhost:8000/posts/noticecomment/${noticeId}`, {
          content: editTargetReview,
        })
        .then(result => {
          const { reviews: newReviews } = result.data.data;
          console.log(newReviews);
          setReviews(newReviews);
          setIsEditReview(false); // 수정모드 OFF
          setToggleReview(prev => !prev);
        });
    }
  };

  // 리뷰 4개씩 보여주기
  const showReviewsByFour = () => {
    const residual = reviews.length % STD_NUM;
    if (residual === 0) {
      // 4의 배수만큼 리뷰 개수가 존재할 때 -> 16 이면 std = 4
      const compareStd = parseInt(reviews.length / STD_NUM);
      if (compareStd > std) {
        setStd(prev => prev + 1);
      } else {
      }
    } else {
      // 4의 배수가 아닌 만큼 리뷰 개수가 존재할 때
      const compareStd = parseInt(reviews.length / STD_NUM) + 1;
      if (compareStd > std) {
        setStd(prev => prev + 1);
      } else {
      }
    }
  };

  // 리뷰 접기
  const initReviews = () => {
    setStd(1);
    setModifiedReviews(reviews.slice(0, STD_NUM * 1));
    setIsFirst(true);
  };

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
      {/* review */}
      {tokenPrice && (
        <div className="mt-4 w-4/5 mx-auto space-y-6 tablet:space-y-8 desktop:space-y-10 tablet:w-5/6">
          <div className="space-y-2">
            <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
              # 댓글 작성하고 래플 참여하기
            </h3>
            <h5 className="text-base text-center font-title tablet:text-lg desktop:text-xl">
              댓글 작성 시 MODE 토큰이 소요됩니다.
            </h5>
          </div>

          <div className="px-2 py-4 flex flex-col bg-purple-500 border-[1px] border-black rounded-2xl drop-shadow-2xl">
            <span className="mr-2 text-xs text-slate-50 font-semibold self-end tablet:text-sm">
              {reviewsCount > 0 && `총 ${reviewsCount}개의 리뷰`}
            </span>
            {isLoggedIn || isAdmin ? (
              <div>
                {haveReview ? null : (
                  <div className="w-9/10 mx-auto px-6 py-4 flex flex-col space-y-2 tablet:px-8 tablet:py-6 tablet:w-3/4 desktop:px-12 desktop:py-10">
                    <div className="flex items-center space-x-1">
                      <div className="text-base font-semibold tablet:text-lg desktop:text-xl">
                        {loggedInUser.nickname}
                      </div>
                    </div>
                    <input
                      type="text"
                      ref={reviewRef}
                      placeholder="최소 15자 이상 작성해주세요."
                      className="px-2 pb-0.5 bg-transparent border-b-2 border-b-black focus:outline-none focus:border-b-[3px] text-white text-sm placeholder:text-white tablet:text-base tablet:px-4 desktop:pb-1 desktop:px-5"
                      onChange={e => setMyReview(e.target.value)}
                    />
                    <button
                      className="self-end px-1.5 py-1 bg-violet-700 hover:bg-violet-900 text-white text-sm font-medium rounded-md tablet:px-2 tablet:py-1 desktop:px-2.5 desktop:py-1.5"
                      onClick={sendReview}
                    >
                      작성하기
                    </button>
                  </div>
                )}

                <div>
                  <div className="px-10 py-7 space-y-3 divide-y-2 divide-black tablet:space-y-7 desktop:space-y-9">
                    {reviews?.length ? (
                      modifiedReviews.map((review, idx) => {
                        return (
                          <div key={idx}>
                            <div className="flex flex-col justify-start items-start space-y-2 text-black">
                              <div className="w-full flex flex-col space-y-1">
                                <span className="text-base font-semibold">
                                  <Link to={`/user/${review.nickname}`}>
                                    {review.nickname}
                                  </Link>
                                </span>
                                <div className="w-full flex items-center justify-start space-x-4">
                                  <div className="px-1 flex items-center space-x-0.5 bg-cyan-500 rounded-full">
                                    <svg
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      className="w-3 h-3 stroke-slate-900"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-xs font-semibold text-slate-900">
                                      {review.create_at}
                                    </span>
                                  </div>
                                  {loggedInUser.nickname === review.nickname ? (
                                    <div className="space-x-0.5">
                                      {/* 📍 수정 버튼 */}
                                      {!isEditReview ? (
                                        // 수정모드 OFF
                                        <div className="text-xs font-semibold text-yellow-500 space-x-2">
                                          <button
                                            onClick={() => {
                                              setIsEditReview(true);
                                              setEditTargetReview(
                                                review.content
                                              );
                                            }}
                                            className="hover:scale-105"
                                          >
                                            수정
                                          </button>
                                        </div>
                                      ) : (
                                        // 수정모드 ON
                                        <div>
                                          <input
                                            type="text"
                                            value={editTargetReview}
                                            onChange={e =>
                                              setEditTargetReview(
                                                e.target.value
                                              )
                                            }
                                          />
                                          <button
                                            onClick={() => {
                                              setIsEditReview(false);
                                            }}
                                          >
                                            취소
                                          </button>
                                          <button onClick={editReview}>
                                            수정
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              {/* 📍 리뷰 내용 */}
                              {loggedInUser.nickname === review.nickname &&
                              isEditReview ? null : (
                                <div className="text-sm">{review.content}</div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          className="w-8 h-8 tablet:w-10 tablet:h-10 stroke-slate-50"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                          />
                        </svg>
                        <span className="text-lg text-slate-50 font-semibold">
                          리뷰가 없습니다
                        </span>
                      </div>
                    )}
                    <div>
                      <div>
                        {reviews?.length ? (
                          // ⭕️ 리뷰 뿌려주기
                          modifiedReviews.map((review, idx) => {
                            return (
                              <div key={idx}>
                                <div>
                                  <Link to={`/user/${review.nickname}`}>
                                    <div className="mt-4 font-bold">
                                      {review.nickname}
                                    </div>
                                  </Link>
                                  <span className="text-xs font-semibold inline-block px-1 py-0.5 bg-cyan-400 rounded-full text-slate-50">
                                    {review.create_at}
                                  </span>
                                  {/* 📍 리뷰 내용 */}
                                  {loggedInUser.nickname === review.nickname &&
                                  isEditReview ? null : (
                                    <div className="text-sm">
                                      {review.content}
                                    </div>
                                  )}
                                </div>
                                {loggedInUser.nickname === review.nickname ? (
                                  <div className="space-x-2">
                                    {/* 📍 수정 버튼 */}
                                    {!isEditReview ? (
                                      // 수정모드 OFF
                                      <div>
                                        <button
                                          onClick={() => {
                                            setIsEditReview(true);
                                            setEditTargetReview(review.content);
                                          }}
                                          className="bg-yellow-300 px-2 py-0.5 rounded-full inline-block text-center text-xs text-slate-800"
                                        >
                                          수정
                                        </button>
                                      </div>
                                    ) : (
                                      // 수정모드 ON
                                      <div>
                                        <input
                                          type="text"
                                          value={editTargetReview}
                                          onChange={e =>
                                            setEditTargetReview(e.target.value)
                                          }
                                        />
                                        <button
                                          onClick={() => {
                                            setIsEditReview(false);
                                          }}
                                        >
                                          취소
                                        </button>
                                        <button onClick={editReview}>
                                          수정
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        ) : (
                          <div>리뷰가 없습니다.</div>
                        )}
                      </div>
                      <div className="flex justify-center">
                        {!isLast && (
                          <button
                            onClick={showReviewsByFour}
                            className="bg-slate-50 hover:bg-yellow-200 px-2 py-1 text-base font-semibold rounded-full shadow-md"
                          >
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </button>
                        )}
                        {!isFirst && (
                          <button
                            onClick={initReviews}
                            className="bg-slate-50 hover:bg-yellow-200 px-2 py-1 text-base font-semibold rounded-full shadow-md"
                          >
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {reviewsCount > 0 ? (
                    <div className="flex justify-center relative">
                      <button
                        onClick={showReviewsByFour}
                        className="inline-block mx-auto mt-2 font-semibold text-xs px-1.5 py-0.5 bg-yellow-500 rounded-full shadow-sm hover:scale-105 cursor-pointer"
                      >
                        4개씩 펼치기
                      </button>
                      {!isFirst && (
                        <button
                          onClick={initReviews}
                          className="absolute bottom-0.5 right-0.5 hover:scale-110"
                        >
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 tablet:w-5 tablet:h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className="mb-40" />
    </div>
  );
}

export { ReadNotice };
