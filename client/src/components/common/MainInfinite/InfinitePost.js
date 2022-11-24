import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import Swal from "sweetalert2";
import CardPost from "../CardPost";

export default function InfinitePost() {
  const [mainPosts, setMainPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8000/posts/board/?page=${pageNum}`
      );
      console.log(result.data.posts);
      // 📍
      if (result.data.posts.length === 0) setIsLast(true);
      setMainPosts(prevPosts => [...prevPosts, ...result.data.posts]);
      setLoading(false);
      setPageNum(prevPageNum => prevPageNum + 1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "서버로부터 데이터를 불러올 수 없습니다.",
      });
    }
  };

  useEffect(() => {
    // 📍 if문
    if (!isLast) {
      fetchData();
      setLoading(true);
    }
  }, [inView]);

  return (
    <div className="mt-32 space-y-10 mx-auto flex flex-col items-center max-w-[1000px]">
      <h1 className="text-3xl font-semibold"># 뜨끈뜨끈한 신상룩</h1>
      <div className="mb-10 px-20 py-16 space-y-2 shadow-2xl rounded-xl bg-slate-100">
        <div className="grid grid-cols-3 gap-16">
          {mainPosts.map((post, idx) => (
            <div key={idx}>
              <CardPost post={post} section="mainPosts" />
            </div>
          ))}
        </div>
        <div ref={ref} className="w-1 h-1"></div>
        <div className="flex justify-center">
          {loading && <HashLoader color={"#36d7b7"} />}
        </div>
      </div>
    </div>
  );
}
