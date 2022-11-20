import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const dummyData = {
  id: 1,
  image_1:
    "https://i.pinimg.com/564x/0c/5a/23/0c5a23ce4a1d9a7b4469caecffc8f38c.jpg",
  image_2:
    "https://i.pinimg.com/564x/96/15/6c/96156c53547ddd6377035f55e72b4849.jpg",
  image_3:
    "https://i.pinimg.com/564x/d9/99/df/d999df1b52510f60eb53500cc334dc9b.jpg",
  title: "안녕하세요! 오늘도 찾아왔습니다 데일리룩 모음!!",
  content:
    "요즘 안경으로 포인트 주는 게 좋더라구요😊 가볍게 가볍게 입어서 좋은 계절!",
  category: "casual",
  price: 0,
  views: 23456,
  top_post: false,
  UserNickname: "jinlimi",
  createdAt: "2022-11-18",
  updatedAt: "2022-11-18",
};

const similarLooks = [
  "https://i.pinimg.com/564x/f7/7a/0e/f77a0e8ec2177260375670a5df258905.jpg",
  "https://i.pinimg.com/564x/c8/31/d1/c831d1c3d02959be2b460e9529017437.jpg",
  "https://i.pinimg.com/564x/37/ef/2a/37ef2ab5d8f50a2bd09b92c72bb8fd8e.jpg",
  "https://i.pinimg.com/564x/56/a4/25/56a4258b2e834eb6f486898d2192f724.jpg",
];

function ReadPost() {
  const userInfo = useSelector(state => state.user);
  const [like, setLike] = useState(false);
  const { id } = useParams();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "0px",
  };

  const likeHandler = e => {
    alert(
      "좋아요를 누르시면 5토큰이 차감되며, 좋아요를 취소하셔도 반환되지 않습니다."
    );
    setLike(true);
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
  const imageList = [dummyData.image_1, dummyData.image_2, dummyData.image_3];

  return (
    <div className="mt-8 flex flex-col justify-center items-center">
      <div className="flex flex-col">
        {/* 🟠포스팅 제목 및 카테고리 */}
        <div className="self-start inline-block text-xs px-2 py-1 w-fit font-bold bg-amber-200 rounded-full drop-shadow-sm">
          {dummyData.category}
        </div>
        <h1 className="m-2 text-3xl font-bold text-start">
          {dummyData.title}{" "}
        </h1>
        <div className="m-1 border-b-[2px] border-black" />

        <div className="w-full flex flex-row">
          {/* 🟠포스팅 정보 수정 관련: 작성한 유저만 볼 수 있게 */}
          <div className="flex">
            <button className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md">
              상단 게시물
            </button>
            <button className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md">
              삭제
            </button>
            <button className="m-1 inline-flex w-fit px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md">
              수정
            </button>
          </div>
          <div className="flex">
            <div className="text-sm font-medium">{dummyData.createdAt}</div>
            {/* 🟠조회수: 예쁘게 보이게 하기 */}
            <div className="text-sm font-medium">
              조회수: {dummyData.views}회
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
              <img className="h-96" src={item}></img>
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
                {similarLooks.map((item, idx) => (
                  <div>
                    <img className="h-48 justify-center" src={item}></img>
                    <div className="absolute text-white text-center text-lg w-full h-full bottom-0 bg-black opacity-0 hover:h-full hover:opacity-30 duration-500 cursor-pointer">
                      페이지 이동
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        {/* 🟠유저 정보: 유저 이름을 클릭하면 채팅하기, 팔로우하기, 유저페이지 선택 */}
        <div className="ml-6">
          <div className="w-96 px-2 py-2 flex flex-col border-2 border-black bg-slate-300 rounded-md drop-shadow-sm">
            <div className="flex flex-row px-2 py-1">
              <img
                className="w-16 h-16 flex rounded-full"
                src="https://i.pinimg.com/564x/86/fe/af/86feaf5b773fb076244fb7a7330dc2d8.jpg"
              ></img>

              <div className="flex flex-col ml-3">
                <div className="h-min flex flex-row">
                  <div className="text-lg font-bold">
                    {dummyData.UserNickname}
                  </div>
                  <div className='"self-start inline-block text-xs px-2 py-1 w-fit font-light text-white bg-blue-900 rounded-full drop-shadow-sm"'>
                    팔로워 12.0k
                  </div>
                </div>

                <div className="text-sm">자연스럽게 예쁜 룩을 추구합니다:)</div>
                {/* 🟠nft 정보: nft 보유 여부에 따라 map */}
                <div classNAme="flex flex-row">
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
            <div className="mx-2 mt-2 mb-4">{dummyData.content}</div>
            <button onClick={likeHandler}>
              {like ? (
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
          <div>
            <div className="mt-8 text-2xl font-bold">#Looks Info</div>
            <div className="w-96 px-2 py-2 flex flex-col border-2 border-black bg-slate-300 rounded-md drop-shadow-sm">
              <div>상의: 어디껀지 몰라도 참 이쁘다. </div>
              <div>하의: 보세 옷을 입어도 브랜드를 묻는 dm이 올 것 같다. </div>
              <div>신발: 신발도 이뻐...</div>
            </div>
          </div>

          {/* 🟠review */}
          <div className="mt-8 text-2xl font-bold">#Review</div>
          <div className="w-96 px-2 py-2 flex flex-col bg-slate-300 border-2 border-black rounded-md drop-shadow-sm ">
            {userInfo.isLoggedIn ? (
              <div>
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <img
                      className="w-6 h-6 rounded-full"
                      src="https://i.pinimg.com/564x/86/fe/af/86feaf5b773fb076244fb7a7330dc2d8.jpg"
                    ></img>
                    <div className="font-bold">
                      {userInfo.userInfo.nickname}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="리뷰는 최소 15자 이상 작성해주세요."
                    className="rounded-md h-12 inner-shadow"
                  ></input>
                  <button className="m-1 self-end inline-flex w-fit px-3 py-1 bg-violet-700 hover:bg-violet-900 text-white text-sm font-medium rounded-md">
                    작성하기
                  </button>
                </div>
                <div>
                  <div className="mt-4 font-bold">Jason Kim</div>
                  <div>아우터 정보 찾고 있었는데 감사합니당 </div>
                  <div className="mt-4 font-bold">jangsam</div>
                  <div>로그인해야 댓글 볼 수 있게 해주세용!</div>
                  <div className="mt-4 font-bold">성장하는 괴물 이현종</div>
                  <div>시원하게 정보 공개해주셔서 감사합니다</div>
                </div>
              </div>
            ) : (
              <div>
                {/* 리뷰 가리고 리뷰 보고 싶으면 로그인하라고 해주기 */}
                <div className="mt-4 font-bold">Jason Kim</div>
                <div>신발 정보 찾고 있었는데 감사합니다! </div>
                <div className="mt-4 font-bold">jangsam</div>
                <div>와 이 분 팔로워 벌써 십만 넘으셨네여...축하드립니다</div>
                <div className="mt-4 font-bold">성장하는 괴물 이현종</div>
                <div>오늘도 정보가 시원하네요</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

export { ReadPost };
