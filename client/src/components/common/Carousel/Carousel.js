import { convert } from "../../../store/screenMode";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import PostCard from "../\bPostCard";

const StyledSlider = styled(Slider)`
  width: 90%;
  position: relative;
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
  const { settings, children } = props;
  return <StyledSlider {...settings}>{children}</StyledSlider>;
};

export default function Carousel({ posts }) {
  const dispatch = useDispatch();
  const { currentScreenMode: screenMode } = useSelector(
    state => state.currentScreenMode
  );

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3300,
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

  return (
    <div className="relative my-32 px-10 pt-2 pb-16 rounded-2xl tablet:pt-6 tablet:pb-20 tablet:rounded-t-3xl desktop:px-20 desktop:pb-24">
      <div className="absolute top-0 left-0 right-0 mx-auto w-2/5 border-t-4 border-t-yellow-400" />
      <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
        # 이런 룩은 어때요? 🎁
      </h3>
      <div className="pt-8 tablet:pt-12 desktop:pt-16">
        <div className="relative">
          {SlickSlider({
            settings,
            children: posts.map((post, idx) => (
              <PostCard post={post} section="topPosts" key={idx} />
            )),
          })}
        </div>
      </div>
    </div>
  );
}
