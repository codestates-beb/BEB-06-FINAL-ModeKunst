// 🗒 TODOS
// 1) REACT-QUERY, 로딩스피너 적용
// 2) Card 삭제해야 함
// 3) Carousel -> API 데이터 바인딩

import axios from "axios";
import styled from "styled-components";
import { convert } from "../../../store/screenMode";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import Card from "./Card";

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

export default function Carousel() {
  const dispatch = useDispatch();
  const { currentScreenMode: screenMode } = useSelector(
    state => state.currentScreenMode
  );

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: screenMode === "mobile" ? 1 : screenMode === "tablet" ? 2 : 3,
    slidesToScroll:
      screenMode === "mobile" ? 1 : screenMode === "tablet" ? 2 : 3,
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
            screenMode,
            children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
              (item, idx) => (
                <Card
                  key={idx}
                  imageUrl="data:image/jpeg;base64,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"
                />
              )
            ),
          })}
        </div>
      </div>
    </div>
  );
}
