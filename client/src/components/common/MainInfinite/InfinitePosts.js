import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PostCard from "../\bPostCard";
import ClipLoader from "react-spinners/ClipLoader";

export default function InfinitePosts() {
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageEndRef = useRef();

  const fetchPosts = async pageNum => {
    setIsLoading(true);
    try {
      const {
        data: { posts },
      } = await axios.get(`http://localhost:8000/posts/main/?page=${pageNum}`, {
        withCredentials: true,
      });
      setPosts(prevPosts => [...prevPosts, ...posts]);
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "서버로부터 데이터를 불러올 수 없습니다.",
      });
    }
  };

  // loadMore -> pageNum 증가 -> fetchPosts -> 기존 포스트에 더할 포스트 더 불러옴
  const loadMore = () => {
    setPageNum(prevPageNum => prevPageNum + 1);
  };

  useEffect(() => {
    fetchPosts(pageNum);
  }, [pageNum]);

  useEffect(() => {
    if (isLoading) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
      observer.observe(pageEndRef.current);
    }
  }, [isLoading]);

  return (
    <div className="relative my-32 px-10 pt-2 pb-16 rounded-2xl tablet:pt-6 tablet:pb-20 tablet:rounded-t-3xl desktop:px-20 desktop:pb-24">
      <div className="absolute top-0 left-0 right-0 mx-auto w-2/5 border-t-4 border-t-blue-500" />
      <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
        # 실시간 LOOK ⌚️
      </h3>
      <div className="pt-8 grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:pt-12 desktop:grid-cols-4 desktop:gap-28 desktop:pt-16">
        {posts.map((post, idx) => (
          <PostCard section="main" key={idx} post={post} />
        ))}
      </div>
      {isLoading && (
        <div className="mt-10 text-center">
          <ClipLoader color="#2155CD" />
        </div>
      )}
      <div ref={pageEndRef} className="w-4 h-4 mx-auto" />
    </div>
  );
}
