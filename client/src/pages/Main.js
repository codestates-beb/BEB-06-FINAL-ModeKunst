// 🗒 TODOS
// 1) 로그인 하지 않은 유저가 게시물을 클릭하면 페이지 이동을 막아야 함

import { useEffect } from "react";
import { useSelector } from "react-redux";
import user from "../store/user";
import axios from "axios";
import Banner from "../components/common/Banner";
import Carousel from "../components/common/Carousel/Carousel";
import InfinitePosts from "../components/common/MainInfinite/InfinitePosts";

function Main() {
  // const userInfo = useSelector(state => state.user);
  // 👇🏻👇🏻 axios 👇🏻👇🏻

  return (
    <div className="px-10 my-40 tablet:px-16 tablet:my-64">
      <Banner />
      <Carousel />
      <InfinitePosts />
    </div>
  );
}

export { Main };
