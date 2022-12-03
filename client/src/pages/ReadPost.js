// 🗒 TODOS
// 1. 좋아요 누르니까 로그인했는데 로그인 하라고 하면서 로그아웃 됨
// 2. 비슷한 룩 선택할 때 css 이상하게 들어감
// 3. 리뷰 펼치고 접을 때 애니메이션 적용하기

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { convert } from "../store/screenMode";
import Card from "../components/common/Carousel/Card";
import cls from "../utils/setClassnames";

const StyledSlider = styled(Slider)`
  width: 100%;
  position: relative;
  background-color: ${props => (props.std === 2 ? "#A0D995" : "#F8B400")};
  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }
`;
const Div = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 16px;
  z-index: 9;
  text-align: right;
  line-height: 30px;
  color: black;
  &:hover {
    color: black;
    cursor: pointer;
  }
`;
const DivPre = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  left: 16px;
  z-index: 9;
  text-align: left;
  line-height: 30px;
  color: black;
  &:hover {
    color: black;
    cursor: pointer;
  }
`;
const SlickSlider = props => {
  const { settings, children, colorStd } = props;

  return (
    <StyledSlider std={colorStd} {...settings}>
      {children}
    </StyledSlider>
  );
};

function ReadPost() {
  const { userInfo: loggedInUser, isLoggedIn } = useSelector(
    state => state.user
  );
  const { currentScreenMode: screenMode } = useSelector(
    state => state.currentScreenMode
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reviewRef = useRef();

  // 슬라이더 색깔
  const COLOR_STD1 = 1;
  const COLOR_STD2 = 2;

  // 포스트 & 리뷰 관련 state
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [names, setNames] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState("");
  const [likeCount, setLikeCount] = useState("");
  const [similarLook, setSimilarLook] = useState("");
  const [post, setPost] = useState("");
  const [writer, setWriter] = useState("");
  const [writerProfile, setWriterProfile] = useState("");
  const [myReview, setMyReview] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [haveReview, setHaveReview] = useState(false);

  const imageList = [
    post.image_1,
    post.image_2,
    post.image_3,
    post?.image_4,
    post?.image_5,
  ].filter(item => item && item);

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

  const screenModeHandler = () => {
    if (window.innerWidth <= 769) {
      dispatch(convert("mobile"));
    } else if (window.innerWidth <= 1279) {
      dispatch(convert("tablet"));
    } else {
      dispatch(convert("desktop"));
    }
  };

  useEffect(() => {
    window.addEventListener("load", screenModeHandler);
    window.addEventListener("resize", screenModeHandler);
    return () => {
      window.removeEventListener("load", screenModeHandler);
      window.removeEventListener("resize", screenModeHandler);
    };
  }, []);

  // 유저페이지 정보(리뷰 제외) 가져오기
  useEffect(() => {
    async function fetchDatasExceptReply() {
      try {
        const {
          data: { data },
        } = await axios.get(`http://localhost:8000/posts/${id}`, {
          withCredentials: true,
        });
        console.log(data);
        setWriter(data.user.nickname);
        setWriterProfile(data.user.profile_img);
        setPost(data.post);
        setLikeCount(data.likes_num);
        setReviewsCount(data.reviews_num);
        setSimilarLook(data.similarLook);
        setIsOwner(data.isOwner);
        setIsFollow(data.isFollow);
        setIsLike(data.isLike);
        setBrand(data.product_brand);
        setSize(data.product_size);
        setNames(data.product_name);
        setHaveReview(data.haveReview);
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: `${error.message}`,
        });
      }
    }
    fetchDatasExceptReply();
  }, [id]);

  // 유저페이지 리뷰 목록 가져오기
  useEffect(() => {
    axios.get(`http://localhost:8000/posts/review/${id}`).then(result => {
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

  const sendMessage = () => {};

  const likeHandler = () => {
    Swal.fire({
      icon: "info",
      text: "좋아요를 누르면 5 MODE 만큼 차감되며 좋아요를 취소해도 반환되지 않습니다.",
    });
    if (!isLike) {
      axios
        .post(`http://localhost:8000/posts/like/${id}`)
        .then(result => {
          const data = result.data;
          setLikeCount(data.data.likes);
          setIsLike(data.data.isLike);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            text: `${error.response.data.message}`,
          });
          if (error.response.status === 401) {
            navigate("/login");
          }
        });
    } else {
      axios
        .post(`http://localhost:8000/posts/unlike/${id}`)
        .then(result => {
          const data = result.data;
          setLikeCount(data.data.likes);
          setIsLike(data.data.isLike);
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            text: `${error.response.data.message}`,
          });
          navigate("/login");
        });
    }
  };

  // 리뷰 작성
  const sendReview = () => {
    if (myReview.length < 15) {
      Swal.fire({
        icon: "warning",
        text: "리뷰는 15자 이상 작성해주세요.",
      });
    } else {
      axios
        .post(`http://localhost:8000/posts/review/${id}`, {
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
    }
  };

  // 리뷰 수정
  const editReview = () => {
    if (editTargetReview.length < 15) {
      Swal.fire({ icon: "warning", text: "리뷰는 15자 이상 작성해주세요." });
    } else {
      axios
        .put(`http://localhost:8000/posts/review/${id}`, {
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

  // 리뷰 삭제
  const deleteReview = () => {
    axios.delete(`http://localhost:8000/posts/review/${id}`).then(result => {
      const { reviews: newReviews, review_counts: newReviewsCount } =
        result.data.data;
      setReviews(newReviews);
      setReviewsCount(newReviewsCount);
      setHaveReview(false);
    });
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

  // 해당 게시물 메인 페이지 탑으로 이동
  const moveToMainTop = () => {
    axios
      .post(`http://localhost:8000/posts/upstream`, {
        id: id,
      })
      .then(result => {
        alert(result.data.message);
      })
      .catch(e => {
        alert(e.response.data.message);
      });
  };

  const reportUser = () => {
    console.log(1);
    axios
      .post(`http://localhost:8000/users/report`, {
        reported: writer,
      })
      .then(result => {
        alert(result.data.message);
      });
  };

  const moveUpdate = () => {
    // 업데이트 창 주소로 이동
  };

  // 게시물 삭제
  const deletePost = () => {
    axios.delete(`http://localhost:8000/posts/${id}`).then(result => {
      Swal.fire({
        icon: "info",
        text: `${result.data.message}`,
      }).then(() => navigate("/"));
    });
  };

  const moveToDetail = e => {
    navigate(`/post/${e.target.id}`);
  };

  // 게시물 사진 슬라이드 세팅
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: screenMode === "mobile" ? 1 : screenMode === "tablet" ? 2 : 3,
    slidesToScroll: 1,
    nextArrow: (
      <Div>
        <svg
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
      </Div>
    ),
    prevArrow: (
      <DivPre>
        <svg
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
      </DivPre>
    ),
  };

  // 시밀러 룩 슬라이드 세팅
  const settingsSimilar = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: screenMode === "mobile" ? 1 : screenMode === "tablet" ? 2 : 3,
    slidesToScroll: 1,
    nextArrow: (
      <Div>
        <svg
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
      </Div>
    ),
    prevArrow: (
      <DivPre>
        <svg
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
      </DivPre>
    ),
  };

  return (
    <div className="max-w-[1400px] w-full px-10 my-40 flex flex-col items-center tablet:px-16 tablet:my-64 select-none">
      {/* 포스트 제목 & 기타 버튼 모음 */}
      <div className="w-full flex flex-col space-y-1 tablet:w-3/4">
        <span className="ml-2 w-fit inline-block text-xs text-white px-1 py-0.5 bg-amber-300 rounded-full drop-shadow tablet:px-2 tablet:py-1 tablet:text-sm">
          {post.category}
        </span>
        <h1 className="px-2 flex justify-between font-title text-2xl font-semibold">
          <span className="font-title font-semibold text-2xl tablet:text-3xl desktop:text-4xl">
            {post.title}
          </span>
          <div className="space-x-2 tablet:space-x-3">
            <button
              className="px-0.5 text-xs text-white bg-sky-400 rounded-sm hover:scale-105 tablet:px-1 tablet:text-sm desktop:rounded-md"
              onClick={moveToMainTop}
            >
              끌어올리기{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-4 tablet:h-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={reportUser}
              className="px-0.5 text-xs text-white bg-red-400 rounded-sm hover:scale-105 tablet:px-1 tablet:text-sm desktop:rounded-md"
            >
              신고{" "}
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-4 tablet:h-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                />
              </svg>
            </button>
          </div>
        </h1>
        <div className="border-b-[2px] border-black" />
        <div className="px-2 w-full flex justify-between">
          <div className="flex items-center space-x-2 tablet:space-x-3">
            {isOwner && (
              <div className="flex space-x-1 tablet:space-x-2">
                <button className="flex justify-center items-center px-1 text-xs rounded-md tablet:p-1 tablet:text-sm tablet:rounded-md">
                  <Link to={`/reset/post/${id}`}>수정</Link>
                </button>
                <button
                  className="flex justify-center items-center px-1 text-xs rounded-md tablet:p-1 tablet:text-sm tablet:rounded-md"
                  onClick={deletePost}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2 text-xs font-semibold tablet:text-sm tablet:space-x-3">
            <div className="flex items-center">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-3 tablet:h-3 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{post.createdAt}</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-3 tablet:h-3 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{post.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 포스트 섹션들 */}
      <div className="w-full grid grid-cols-1 gap-1 place-items-start tablet:grid-cols-2">
        {/* 유저 정보: 유저 이름을 클릭하면 채팅하기, 팔로우하기, 유저페이지 선택 */}
        <div className="w-full mx-auto space-y-6 tablet:space-y-8 desktop:space-y-10 tablet:w-5/6">
          <div className="space-y-2">
            <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
              # 글쓴이 정보
            </h3>
            <h5 className="text-base text-center font-title tablet:text-lg desktop:text-xl">
              해당 포스트의 주인입니다
            </h5>
          </div>
          <div className="bg-slate-300 border-[3px] border-black rounded-2xl">
            <div className="flex items-center space-x-5 px-4 py-3">
              <img
                src={writerProfile}
                alt="write_profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col items-start space-y-0.5">
                <div className="space-x-1">
                  <span className="text-base font-semibold">
                    <Link to={`/user/${writer}`}>{writer}</Link>
                  </span>
                  <button className="p-1 bg-blue-500 rounded-full hover:bg-yellow-500">
                    <Link to={"/chat"} state={writer}>
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        className="w-3 h-3 stroke-slate-100 tablet:w-4 tablet:h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                        />
                      </svg>
                    </Link>
                  </button>
                </div>
                <div className="flex space-x-1 tablet:space-x-2">
                  <div className="inline-block text-xs px-1 py-0.5 font-semibold bg-amber-200 rounded-full drop-shadow-sm">
                    이스터 에그
                  </div>
                  <div className="inline-block text-xs px-1 py-0.5 font-semibold bg-cyan-400 rounded-full drop-shadow-sm">
                    내가 짱이다
                  </div>
                  <div className="inline-block text-xs px-1 py-0.5 font-semibold bg-purple-400 rounded-full drop-shadow-sm">
                    자라 가야됨
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/3 mx-auto mt-4 border-b-2 border-slate-400" />
            <div className="px-5 mt-2 mb-4 font-semibold tablet:px-10">
              {post.content}
            </div>
            <div className="flex items-center px-2 py-2 space-x-0.5 tablet:space-x-1 tablet:px-4">
              <button onClick={likeHandler}>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={cls(
                    "w-5 h-5 tablet:w-6 tablet:h-6",
                    isLike ? "fill-red-500" : ""
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <span className="">{likeCount > 0 ? likeCount : 0}</span>
            </div>
          </div>
        </div>

        {/* 사진 3장 */}
        <div className="w-full mx-auto text-center space-y-2 tablet:w-5/6">
          <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
            # 사진 모음
          </h3>
          <h5 className="text-base font-title tablet:text-lg desktop:text-xl">
            관심있는 룩을 살펴보세요!
          </h5>
          <div className="pt-4 tablet:pt-6 desktop:pt-8">
            {SlickSlider({
              settings,
              screenMode,
              colorStd: 1,
              children: imageList.map((item, idx) => (
                <Card key={idx} imageUrl={item} />
              )),
            })}
          </div>
        </div>

        {/* 시밀러 룩 */}
        <div className="w-full mx-auto text-center space-y-2 tablet:w-5/6">
          <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
            # 시밀러 룩
          </h3>
          <h5 className="text-base font-title tablet:text-lg desktop:text-xl">
            비슷한 카테고리의 룩을 살펴볼 기회예요!
          </h5>
          <div className="pt-4 tablet:pt-6 desktop:pt-8">
            {SlickSlider({
              settings,
              screenMode,
              colorStd: 2,
              children: similarLook
                ? similarLook.map((item, idx) => (
                    <Card key={idx} imageUrl={item.image_1} />
                  ))
                : null,
            })}
          </div>

          {/* <div className="p-2 mt-4 bg-slate-300 drop-shadow-md border-2 border-black rounded-md">
            <Slider
              {...settingsSimilar}
              className="max-w-xs max-h-fit border-2 border-gray-800 flex items-center justify-center"
            >
              {similarLook ? (
                similarLook.map((item, idx) => (
                  <div key={idx}>
                    <img
                      className="h-48 justify-center"
                      alt="similar_looks"
                      src={item.image_1}
                    ></img>
                    <div
                      className="absolute text-white text-center text-lg w-full h-full bottom-0 bg-black opacity-0 hover:h-full hover:opacity-30 duration-500 cursor-pointer"
                      id={item.id}
                      onClick={moveToDetail}
                    >
                      페이지 이동
                    </div>
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </Slider>
          </div> */}
        </div>

        {/* 🟠fashion info */}
        {/* {isOwner || isLike || isFollow ? (
            <div>
              {brand && (
                <div>
                  <div className="mt-8 text-2xl font-bold">#Looks Info</div>
                  <div className="w-96 p-2 flex flex-col border-2 border-black bg-slate-300 rounded-md">
                    <div className="self-start flex flex-row px-2">
                      <div className="font-bold text-lg text-center">OUTER</div>
                      {brand.outer ? (
                        <div className="ml-3"> 정보 없음 </div>
                      ) : (
                        <div>
                          <div className="ml-3"> {brand.outer}</div>
                          <div className="ml-2"> {names.outer}</div>
                          <div className="ml-2">사이즈 {size.outer}</div>
                        </div>
                      )}
                    </div>
                    <div className="self-start flex flex-row px-2">
                      <div className="font-bold text-lg text-center">TOP</div>
                      <div className="ml-3">브랜드 {brand.top}</div>
                      <div className="ml-2">이름 {names.top}</div>
                      <div className="ml-2">사이즈 {size.top}</div>
                    </div>
                    <div className="self-start flex flex-row px-2">
                      <div className="font-bold text-lg text-center">
                        BOTTOM
                      </div>
                      <div className="ml-3">브랜드 {brand.pants}</div>
                      <div className="ml-2">이름 {names.pants}</div>
                      <div className="ml-2">사이즈 {size.pants}</div>
                    </div>
                    <div className="self-start flex flex-row px-2">
                      <div className="font-bold text-lg text-center">SHOES</div>
                      <div className="ml-3">브랜드 {brand.shoes}</div>
                      <div className="ml-2">이름 {names.shoes}</div>
                      <div className="ml-2">사이즈 {size.shoes}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {brand && (
                <div>
                  <div className="mt-8 text-2xl font-bold">#Looks Info</div>
                  <div className="w-96 px-2 py-2 flex flex-col drop-shadow-sm border-2 border-black bg-slate-300 rounded-md">
                    <div className="blur-sm w-96 flex flex-col">
                      <div className="self-start flex flex-row px-2">
                        <div className="font-bold text-lg text-center">
                          OUTER
                        </div>
                        {brand.outer ? (
                          <div className="ml-3"> 정보 없음 </div>
                        ) : (
                          <div>
                            <div className="ml-3"> {brand.outer}</div>
                            <div className="ml-2"> {names.outer}</div>
                            <div className="ml-2">사이즈 {size.outer}</div>
                          </div>
                        )}
                      </div>
                      <div className="self-start flex flex-row px-2">
                        <div className="font-bold text-lg text-center">TOP</div>
                        <div className="ml-3">브랜드 {brand.top}</div>
                        <div className="ml-2">이름 {names.top}</div>
                        <div className="ml-2">사이즈 {size.top}</div>
                      </div>
                      <div className="self-start flex flex-row px-2">
                        <div className="font-bold text-lg text-center">
                          BOTTOM
                        </div>
                        <div className="ml-3">브랜드 {brand.pants}</div>
                        <div className="ml-2">이름 {names.pants}</div>
                        <div className="ml-2">사이즈 {size.pants}</div>
                      </div>
                      <div className="self-start flex flex-row px-2">
                        <div className="font-bold text-lg text-center">
                          SHOES
                        </div>
                        <div className="ml-3">브랜드 {brand.shoes}</div>
                        <div className="ml-2">이름 {names.shoes}</div>
                        <div className="ml-2">사이즈 {size.shoes}</div>
                      </div>
                    </div>
                    <div>
                      <div className="m-auto align-middle py-4 text-sm font-bold fixed top-0 right-0 bottom-0 left-0 w-60 h-12 rounded-md text-center bg-white drop-shadow-md">
                        좋아요를 누르고 정보를 확인해보세요!
                        <div className="w-full h-full bg-cyan-200 rounded-b-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* review */}
        <div className="w-full mx-auto space-y-6 tablet:space-y-8 desktop:space-y-10 tablet:w-5/6">
          <div className="space-y-2">
            <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
              # 리뷰
            </h3>
            <h5 className="text-base text-center font-title tablet:text-lg desktop:text-xl">
              리뷰 작성은 최대 1회까지 가능합니다
            </h5>
          </div>

          <div className="px-2 py-4 flex flex-col bg-purple-500 border-[3px] border-black rounded-2xl drop-shadow-2xl">
            <span className="mr-2 text-xs text-slate-50 font-semibold self-end tablet:text-sm">
              {reviewsCount > 0 && `총 ${reviewsCount}개의 리뷰`}
            </span>
            {isLoggedIn ? (
              <div>
                {isOwner ? null : haveReview ? null : (
                  <div className="w-9/10 mx-auto px-6 py-4 flex flex-col space-y-2 tablet:px-8 tablet:py-6 tablet:w-3/4 desktop:px-12 desktop:py-10">
                    <div className="flex items-center space-x-1">
                      <img
                        className="w-8 h-8 rounded-full tablet:w-10 tablet:h-10"
                        alt="loggedin_user_profile"
                        src={writerProfile}
                      />
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
                  <div className="px-10 py-7 space-y-3 tablet:space-y-7 desktop:space-y-9">
                    {reviews?.length ? (
                      modifiedReviews.map((review, idx) => {
                        return (
                          <div
                            key={idx}
                            className="px-4 py-2 bg-slate-300 rounded-md shadow-lg border-2 border-black"
                          >
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
                                          <button
                                            onClick={deleteReview}
                                            className="hover:scale-105"
                                          >
                                            삭제
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
      </div>
      <div className="h-20" />
    </div>
  );
}

export { ReadPost };
