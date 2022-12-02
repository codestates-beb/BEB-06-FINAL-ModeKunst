// 🗒 TODOS
// 1) 로그인 하지 않은 유저가 게시물을 클릭하면 페이지 이동을 막아야 함

import { useEffect } from "react";
import { useSelector } from "react-redux";
import user from "../store/user";
import axios from "axios";
import Banner from "../components/common/Banner";
import Carousel from "../components/common/Carousel/Carousel";
import InfinitePost from "../components/common/MainInfinite/InfinitePost";

function Main() {
  // const userInfo = useSelector(state => state.user);
  // 👇🏻👇🏻 axios 👇🏻👇🏻

  return (
    <div>
      <div className="mt-64" />
      <Banner />
      <Carousel />
      <InfinitePost />
      <div className="mb-64" />
    </div>
  );
}

export { Main };
