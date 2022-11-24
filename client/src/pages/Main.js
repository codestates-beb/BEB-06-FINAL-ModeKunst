import Banner from "../components/common/Banner";
import Carousel from "../components/common/Carousel/Carousel";
import { useSelector } from "react-redux";
import user from "../store/user";
import InfinitePost from "../components/common/MainInfinite/InfinitePost";
import { useEffect } from "react";
import axios from "axios";

function Main() {
  const userInfo = useSelector(state => state.user);

  return (
    <div>
      <Banner />
      {/* 캐러셀 데이터 따로 가지고 오는 거고 */}
      <Carousel />
      <InfinitePost />
    </div>
  );
}

export { Main };
