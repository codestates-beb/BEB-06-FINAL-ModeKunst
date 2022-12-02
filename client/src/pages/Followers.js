import { useSelector } from "react-redux";
import { useLocation, useOutletContext } from "react-router-dom";
import LikesList from "../components/common/Pagination/LikesList";
import { Title } from "../components/form/Title";

function Followers() {
  const { currentScreenMode: screenMode } = useSelector(
    state => state.currentScreenMode
  );
  const location = useLocation();
  // const { followers, nickname } = useOutletContext();
  const followers = location.state?.followers;
  const nickname = location.state?.nickname;

  return (
    <div className="w-full mx-auto py-16 max-w-[1400px] flex flex-col items-center space-y-8 border-2 border-slate-800 bg-violet-600 tablet:px-16 select-none rounded-b-xl">
      <Title title={`#${nickname} 님의 팔로워 리스트 🙆🏻‍♀️`} />
      {followers.length ? (
        <LikesList
          arr={followers}
          section="followers"
          screenMode={screenMode}
        />
      ) : (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-10 h-10 fill-slate-50 mx-auto"
          >
            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
          </svg>
          <span className="text-slate-50 font-semibold">
            현재 팔로워가 없습니다
          </span>
        </div>
      )}
    </div>
  );
}

export { Followers };
