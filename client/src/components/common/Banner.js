import styled from "styled-components";
import Slider from "react-slick";
import BannerPost from "./bannerPost";

const StyledSlider = styled(Slider)`
  width: 90%;
  position: relative;
  background-color: #dae2b6;
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

export default function Banner({ banner }) {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
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
    <div className="h-3/5 relative my-32 px-10 pt-2 pb-16 rounded-2xl tablet:pt-6 tablet:pb-20 tablet:rounded-t-3xl desktop:px-20 desktop:pb-24">
      <div className="flex justify-center items-center">
        {SlickSlider({
          settings,
          children: banner.map((post, idx) => (
            <BannerPost post={post} key={idx} />
          )),
        })}
      </div>
    </div>
  );
}
