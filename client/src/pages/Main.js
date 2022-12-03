// 🗒 TODOS
// 1) 로그인 하지 않은 유저가 게시물을 클릭하면 페이지 이동을 막아야 함

import { useEffect } from "react";
import { useSelector } from "react-redux";
import user from "../store/user";
import axios from "axios";
import { motion } from "framer-motion";
import Banner from "../components/common/Banner";
import Carousel from "../components/common/Carousel/Carousel";
import InfinitePosts from "../components/common/MainInfinite/InfinitePosts";

const mainVar = {
  enter: { opacity: 0 },
  visible: { opacity: 1 },
  invisible: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

function Main() {
  // const userInfo = useSelector(state => state.user);
  // 👇🏻👇🏻 axios 👇🏻👇🏻

  return (
    <motion.div
      variants={mainVar}
      initial="enter"
      animate="visible"
      exit="invisible"
    >
      <div className="mt-64" />
      <Banner />
      <Carousel />
      <InfinitePosts />
      <div className="mb-64" />
    </motion.div>
  );
}

export { Main };
