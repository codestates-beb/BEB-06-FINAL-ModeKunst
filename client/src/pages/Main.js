import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";
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
  const { userInfo: loggedInUser, isLoggedIn } = useSelector(
    state => state.user
  );
  const [topPosts, setTopPosts] = useState([]);
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    async function fetchDatas() {
      try {
        const {
          data: {
            data: { top_posts, banner },
          },
        } = await axios.get("http://localhost:8000/posts/other");
        setTopPosts(top_posts);
        setBanner(banner);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDatas();
  }, []);

  return (
    <motion.div
      variants={mainVar}
      initial="enter"
      animate="visible"
      exit="invisible"
    >
      <div className="mt-64" />
      <Banner banner={banner} />
      <Carousel posts={topPosts} />
      <InfinitePosts />
      <div className="mb-64" />
    </motion.div>
  );
}

export { Main };
