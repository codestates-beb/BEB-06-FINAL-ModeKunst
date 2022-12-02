// screenMode 별 posts per page
// 1) mobile 인 경우 -> 4개
// 2) tablet 인 경우) -> 6개
// 3) desktop 인 경우) -> 8개

import { useEffect, useState } from "react";
import PostCard from "../PostCard";
import FollowCard from "../FollowCard";
import cls from "../../../utils/setClassnames";
import Pagination from "react-js-pagination";
import "./style.css";

export default function LikesList({ arr, section, screenMode }) {
  const POSTS_PER_PAGE =
    screenMode === "mobile" ? 4 : screenMode === "tablet" ? 6 : 8;
  const [pageNum, setPageNum] = useState(1);
  const pagesVisited = (pageNum - 1) * POSTS_PER_PAGE;
  const handleChangePage = selected => setPageNum(selected);

  const showHotPostsAndCollections = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((post, idx) => <PostCard post={post} section={section} key={idx} />);

  const showFollowingsAndFollowers = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((user, idx) => <FollowCard user={user} section={section} key={idx} />);

  useEffect(() => {
    if (pageNum !== parseInt(arr.length / POSTS_PER_PAGE) + 1) setPageNum(1);
  }, [screenMode]);

  return (
    <div>
      <div>
        <div
          className={cls(
            "grid gap-2",
            screenMode === "mobile"
              ? "grid-cols-1"
              : screenMode === "tablet"
              ? "grid-cols-2"
              : "grid-cols-4 gap-3"
          )}
        >
          {section === "hotposts" || section === "collections"
            ? showHotPostsAndCollections
            : showFollowingsAndFollowers}
        </div>
      </div>
      <Pagination
        activePage={pageNum}
        itemsCountPerPage={POSTS_PER_PAGE}
        totalItemsCount={arr.length}
        pageRangeDisplayed={10}
        onChange={handleChangePage}
      />
    </div>
  );
}
