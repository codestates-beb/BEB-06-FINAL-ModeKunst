import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CardPostTwo from "../components/common/CardPost2";

function Search() {
  const { name } = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  const [searchCategory, setSearchCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState([]);
  const [searchContent, setSearchContent] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSelect = e => {
    setSearchCategory(e.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `http://localhost:8000/posts/search/${name}`
      );
      // 📍
      if (result.data.title.length === 0) setIsLast(true);
      setSearchTitle([...result.data.title]);
      if (result.data.content.length === 0) setIsLast(true);
      setSearchContent([...result.data.content]);
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
    if (!isLast) {
      fetchData();
      setLoading(true);
    }
  }, [inView, name]);

  const viewPost = data => {
    if (data) {
      return data.map((post, idx) => (
        <div key={idx}>
          <CardPostTwo post={post} section="searchResults" />
        </div>
      ));
    }
  };

  const changeInputHandler = e => {
    setInput(e.target.value);
  };

  // const pressEnter = e => {
  //   if ((e.key = "Enter")) {
  //     navigate(`/search/${input}`);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row mt-12 my-3 w-2/3 px-6 py-3 border-2 border-black rounded-md focus:outline-none">
        {/* <select
          defaultValue="title"
          className="border-2 border-black rounded-md"
          value={searchCategory}
          onChange={handleSelect}
        >
          <option value="title">제목</option>
          <option value="contents">내용</option>
        </select> */}
        <input
          type="text"
          // onKeyUp={pressEnter}
          onChange={changeInputHandler}
          placeholder="찾고 싶은 컨텐츠의 제목, 내용을 검색해보세요."
          className="flex w-full mx-2 border-transparent focus:border-transparent focus:ring-0"
        />
        <button
          className="hover:scale-110 flex"
          onClick={() => {
            setSearchContent("");
            setSearchTitle("");
            navigate(`/search/${input}`);
            fetchData();
          }}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-slate-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col mt-4 my-3 w-2/3 px-6 py-6  border-2 border-black rounded-md bg-indigo-400">
        <div className="mt-2 mb-6 font-bold text-xl">
          "{name}"(으)로 검색하신 결과예요!
        </div>
        {searchTitle?.length === 0 && searchContent?.length === 0 && (
          <div>검색하신 결과를 찾을 수 없습니다.</div>
        )}
        {searchTitle?.length > 0 && (
          <div>
            <div className="w-full font-bold text-lg">제목 내 검색 결과</div>
            <div className="grid grid-cols-3 gap-16">
              {viewPost(searchTitle)}
            </div>
          </div>
        )}
        {searchContent?.length > 0 && (
          <div>
            <div className="mt-12 font-bold text-lg">내용 내 검색 결과</div>
            <div className="grid grid-cols-3 gap-16">
              {searchContent && viewPost(searchContent)}
            </div>
          </div>
        )}
        <div ref={ref} className="w-1 h-1"></div>
        {loading && <HashLoader color={"#36d7b7"} />}
        <div className="my-12"></div>
      </div>
      <div className="my-12"></div>
    </div>
  );
}

export { Search };
