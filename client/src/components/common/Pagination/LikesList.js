import "./style.css";
import Pagination from "react-js-pagination";
import { useState } from "react";
import CardPost from "../CardPost";
import FollowCard from "../FollowCard";

export default function LikesList({ arr, section }) {
  const [pageNum, setPageNum] = useState(1);
  const POSTS_PER_PAGE = 8;
  const pagesVisited = (pageNum - 1) * POSTS_PER_PAGE;
  const handleChangePage = selected => setPageNum(selected);

  const showHotPostsAndCollections = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((post, idx) => <CardPost post={post} section={section} key={idx} />);

  const showFollowingsAndFollowers = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((user, idx) => <FollowCard user={user} section={section} key={idx} />);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-4 gap-12 min-w-[500px]">
        {section === "hotposts" || section === "collections"
          ? showHotPostsAndCollections
          : showFollowingsAndFollowers}
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
