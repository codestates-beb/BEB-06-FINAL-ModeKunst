import "./style.css";
import Pagination from "react-js-pagination";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// 참고용으로 넣어 놓은 더미데이터
import posts from "./MOCK_DATA.json";

export default function LikesList() {
  // navigate로 pagination 목록별로 클릭 후 이동 가능
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const POSTS_PER_PAGE = 7;
  const pagesVisited = (pageNum - 1) * POSTS_PER_PAGE;
  const handleChangePage = selected => setPageNum(selected);

  // 함수 -> 페이지네이션 메뉴 안에 들어갈 글 목록들 디스플레이 해주는 역할
  const displayPosts = posts
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((post, idx) => (
      <div key={idx}>
        <Link
          className="block mt-2 px-8 py-4 mx-auto w-3/4 bg-slate-100 hover:bg-red-200 shadow-md rounded-lg text-slate-700 hover:text-white font-medium"
          // 이동할 페이지의 경로로 재입력(디테일페이지)
          to={`read/${post.id}`}
          // 페이지 이동 시에 넘길 데이터를 재명시
          state={{ post }}
        >
          <div>{post.id}</div>
          <div>{post.title}</div>
        </Link>
      </div>
    ));

  return (
    <div>
      <div className="mx-48 mt-24 flex flex-col">
        {displayPosts}
        <div className="flex flex-col mt-12 items-center">
          <Pagination
            activePage={pageNum}
            itemsCountPerPage={POSTS_PER_PAGE}
            totalItemsCount={posts.length}
            pageRangeDisplayed={10}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </div>
  );
}
