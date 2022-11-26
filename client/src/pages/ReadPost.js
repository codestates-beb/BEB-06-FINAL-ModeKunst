import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 📌 TODOS
// 1. 좋아요 누르니까 로그인했는데 로그인 하라고 하면서 로그아웃 됨
// 2. 비슷한 룩 선택할 때 css 이상하게 들어감
// 3. 리뷰 펼치고 접을 때 애니메이션 적용하기

function ReadPost() {
  // 전역 state
  const { id } = useParams();
  const userInfo = useSelector(state => state.user);
  const navigate = useNavigate();

  // 포스트, 리뷰 관련 state
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
  const [isLike, setIsLike] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [myReview, setMyReview] = useState("");
  const [haveReview, setHaveReview] = useState(false);
  const reviewRef = useRef();

  // 리뷰 수정 관련 state
  // isEditReview: 리뷰 수정 모드 ON/OFF
  // editTargetReview: 수정한 리뷰 내용(content)
  const [isEditReview, setIsEditReview] = useState(false);
  const [editTargetReview, setEditTargetReview] = useState("");
  const [toggleReview, setToggleReview] = useState(false);

  // 리뷰 펼치기 및 접기 관련 state
  const STD_NUM = 4;
  const [std, setStd] = useState(1);
  const [modifiedReviews, setModifiedReviews] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  // 유저페이지 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/${id}`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.data;
        setWriter(data.user.nickname);
        setWriterProfile(data.user.profile_img);
        setPost(data.post);
        setLikeCount(data.likes_counts);
        setReviewsCount(data.reviews_num);
        setSimilarLook(data.similarLook);
        setIsOwner(data.isOwner);
        setIsFollow(data.isFollow);
        setIsLike(data.isLike);
        setBrand(data.product_brand);
        setSize(data.product_size);
        setNames(data.product_name);
        setHaveReview(data.haveReview);
      })
      .catch(e => {
        console.log(e);
      });
  }, [id]);

  // 유저페이지 리뷰 목록 가져오기
  useEffect(() => {
    console.log(std);

    axios.get(`http://localhost:8000/posts/review/${id}`).then(result => {
      if (std === 1) {
        setReviews(result.data.reviews);
        setIsLast(false);
      }
      setModifiedReviews(result.data.reviews.slice(0, STD_NUM * std));
    });

    if (std >= 2) setIsFirst(false);
    if (std === parseInt(reviews.length / STD_NUM) + 1) setIsLast(true);
  }, [std]);

  // 보여주는 리뷰 개수 변경
  // reviewsCount = 리뷰 작성, 삭제 했을 때 변경
  // toggleReview = 리뷰 수정 시 변경
  useEffect(() => {
    setModifiedReviews(reviews.slice(0, STD_NUM * std));
  }, [reviewsCount, toggleReview]);

  // 사진 슬라이드 세팅
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "0px",
  };

  const sendMessage = () => {};

  const likeHandler = () => {
    alert(
      "좋아요를 누르시면 5토큰이 차감되며, 좋아요를 취소하셔도 반환되지 않습니다."
    );
    if (!isLike) {
      axios
        .post(`http://localhost:8000/posts/like/${id}`)
        .then(result => {
          const data = result.data;
          setLikeCount(data.data.likes);
          setIsLike(data.data.isLike);
          alert(data.message);
        })
        .catch(e => {
          alert(e.response.data.message);
            if((e.response.status) === 401){
              navigator("/login");
            }
        });
    } else {
      axios
        .post(`http://localhost:8000/posts/unlike/${id}`)
        .then(result => {
          const data = result.data;
          setLikeCount(data.data.likes);
          setIsLike(data.data.isLike);
          alert(data.message);
        })
        .catch(e => {
          alert(e.response.data.message);
          navigate("/login");
        });
    }
  };

  // 🟠 리뷰 작성
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

  // 🟠 리뷰 수정
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
          // console.log(newReviews);
          setReviews(newReviews);
          setIsEditReview(false); // 수정모드 OFF
          setToggleReview(prev => !prev);
        });
    }
  };

  // 🟠 리뷰 삭제
  const deleteReview = () => {
    axios.delete(`http://localhost:8000/posts/review/${id}`).then(result => {
      const { reviews: newReviews, review_counts: newReviewsCount } =
        result.data.data;
      setReviews(newReviews);
      setReviewsCount(newReviewsCount);
      setHaveReview(false);
    });
  };

  // 🟠 리뷰 4개씩 보여주기
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

  // 🟠 리뷰 접기
  const initReviews = () => {
    console.log("hi");
    setStd(1);
    setModifiedReviews(reviews.slice(0, STD_NUM * 1));
    setIsFirst(true);
  };

  // 해당 게시물 메인 페이지 탑으로 이동
  const moveTopPost = () => {
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

  const moveUpdate = () => {
    // 업데이트 창 주소로 이동
    // navigator();
  };

  const deletePost = () => {
    axios.delete(`http://localhost:8000/posts/${id}`).then(result => {
      alert(result.data.message);
      navigate("/");
    });
  };

  const moveToDetail = e => {
    navigate(`/post/${e.target.id}`);
  };
  const settingsSimilar = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  //📌 이미지가 null 값인 경우에는 배열에 안들어가게 해야하는지
  //아니면 처음부터 받아올 때 백에서 처리가 되어있는지?
  const imageList = [
    post.image_1,
    post.image_2,
    post.image_3,
    post?.image_4,
    post?.image_5,
  ].filter(item => {
    if (item) return item;
  });

  return (
    <div className="mt-8 flex flex-col justify-center items-center bg-indigo-400 rounded-xl border-2 border-black shadow-xl mx-48 py-20">
      <div className="flex flex-col w-3/4">
        {/* 🟠포스팅 제목 및 카테고리 */}
        <div className="self-start inline-block text-xs px-2 py-1 w-fit font-bold bg-amber-200 rounded-full drop-shadow-sm">
          {post.category}
        </div>
        <h1 className="font-title3 m-2 text-3xl font-bold text-start">
          {post.title}{" "}
        </h1>
        <div className="m-1 border-b-[2px] border-black" />

        <div className="w-full flex flex-row">
          {/* 🟠포스팅 정보 수정 관련: 작성한 유저만 볼 수 있게 */}
          {isOwner ? (
            <div className="flex">
              <button
                className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                onClick={moveTopPost}
              >
                상단 게시물
              </button>
              <button
                className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                onClick={deletePost}
              >
                삭제
              </button>
              <Link to={`/reset/post/${id}`}>
                <button className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md">
                  수정
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex">
            <div className="text-sm font-medium text-end">{post.createdAt}</div>
            {/* 🟠조회수: 예쁘게 보이게 하기 */}
            <div className="ml-3 text-sm font-medium text-end">
              조회수: {post.views}회
            </div>
          </div>
        </div>
      </div>

      {/* 🟠포스팅한 사진: 사진 위에 좋아요 버튼 만들 수 있는지? */}
      <div className="mt-8 grid grid-cols-2">
        <div className="mr-6">
          <Slider
            {...settings}
            className="max-w-xs max-h-fit border-2 border-gray-800 flex items-center justify-center"
          >
            {imageList.map((item, idx) => (
              <img
                key={idx}
                className="h-96"
                alt="post_images"
                src={item}
              ></img>
            ))}
          </Slider>
          {/* 🟠비슷한 룩: 데이터 어떻게 가져와야하지 */}
          <div className="mt-16 w-full">
            <div className="text-2xl font-bold">#Similar Looks</div>
            <div className="p-2 mt-4 bg-slate-300 drop-shadow-md border-2 border-black rounded-md">
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
            </div>
          </div>
        </div>
        {/* 🟠유저 정보: 유저 이름을 클릭하면 채팅하기, 팔로우하기, 유저페이지 선택 */}
        <div className="ml-6">
          <div className="w-96 px-2 py-2 flex flex-col border-2 border-black bg-slate-200 rounded-md drop-shadow-sm">
            <div className="flex flex-row px-2 py-1">
              <img
                className="w-16 h-16 flex rounded-full"
                alt="write_profile"
                src={writerProfile}
              ></img>

              <div className="flex flex-col ml-3">
                <div className="h-min flex flex-row">
                  <Link to={`/user/${writer}`}>
                    <div className="text-lg font-bold">{writer}</div>
                  </Link>
                  <Link to={"/chat"} state={writer}>
                    <button>채팅</button>
                  </Link>
                  <div className='"self-start inline-block text-xs px-2 py-1 w-fit font-light text-white bg-blue-900 rounded-full drop-shadow-sm"'>
                    팔로워 12.0k
                  </div>
                </div>

                <div className="font-content text-sm">
                  자연스럽게 예쁜 룩을 추구합니다:)
                </div>
                {/* 🟠nft 정보: nft 보유 여부에 따라 map */}
                <div className="flex flex-row">
                  <div className="self-start inline-block text-xs px-2 py-1 w-fit font-bold bg-amber-200 rounded-full drop-shadow-sm">
                    캐주얼 top
                  </div>
                  <div className="self-start inline-block text-xs px-2 py-1 w-fit font-bold bg-cyan-400 rounded-full drop-shadow-sm">
                    친절한 정보왕
                  </div>
                  <div className="self-start inline-block text-xs px-2 py-1 w-fit font-bold bg-purple-400 rounded-full drop-shadow-sm">
                    알뜰한 패션리더
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 mx-2 border-b-[1px] border-slate-400" />
            <div className="mx-2 mt-2 mb-4">{post.content}</div>
            <div>{likeCount}</div>
            <button onClick={likeHandler}>
              {isLike ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="bg-red"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="m-1 w-6 h-6 p-1 rounded-full border border-black self-end"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="m-1 w-6 h-6 p-1 rounded-full border border-black self-end"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              )}
            </button>
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
          {/* 🟠review */}
          <div className="mt-8 text-2xl font-bold">
            #Review
            <span className="text-xs ml-5">
              {reviewsCount ? `총 ${reviewsCount}개의 리뷰` : "총 0개의 리뷰"}
            </span>
          </div>
          <div className="w-96 px-2 py-2 flex flex-col bg-slate-300 border-2 border-black rounded-md drop-shadow-2xl">
            {userInfo.isLoggedIn ? (
              <div>
                {/*
                    isOwner = 포스트 작성한 유저 판단 기준
                    - 포스트 작성한 유저라면 -> 리뷰 작성란 보이면 안 됨(null)
                    - 포스트 작성한 유저가 아니라면?
                      haveReview = 리뷰를 작성했는지 여부 판단 기준
                      - 리뷰를 이미 작성했다면 -> 리뷰작성란 보이면 안 됨(null)
                      - 리뷰를 작성하지 않았다면 -> 리뷰작성란 보여야 됨
                */}
                {isOwner ? null : haveReview ? null : (
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                      <img
                        className="w-6 h-6 rounded-full"
                        alt="loggedin_user_profile"
                        src={userInfo.userInfo.profile_img}
                      />
                      <div className="font-bold">
                        {userInfo.userInfo.nickname}
                      </div>
                    </div>
                    <input
                      type="text"
                      ref={reviewRef}
                      placeholder="리뷰는 최소 15자 이상 작성해주세요."
                      className="rounded-md h-12 inner-shadow"
                      onChange={e => setMyReview(e.target.value)}
                    />
                    <button
                      className="m-1 self-end inline-flex w-fit px-3 py-1 bg-violet-700 hover:bg-violet-900 text-white text-sm font-medium rounded-md"
                      onClick={sendReview}
                    >
                      작성하기
                    </button>
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
                              {userInfo.userInfo.nickname === review.nickname &&
                              isEditReview ? null : (
                                <div>{review.content}</div>
                              )}
                            </div>
                            {userInfo.userInfo.nickname === review.nickname ? (
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
                                    <button
                                      className="bg-pink-300 px-2 py-0.5 rounded-full inline-block text-center text-xs text-slate-800"
                                      onClick={deleteReview}
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
                                    <button onClick={editReview}>수정</button>
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
            ) : null}
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

