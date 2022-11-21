// 🗒 CHECK
// - 해당 유저 페이지가 내 페이지인 경우?
//   👉🏻 '내가 좋아요 누른 게시물' 문구 바뀌게 state 별도로 설정해야 함

import LikesList from "../components/common/Pagination/LikesList";

function Collections() {
  return (
    <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
      <h1 className="text-2xl font-semibold"> # 닉네임 님의 좋아요 게시물</h1>
      <LikesList />
    </div>
  );
}
export { Collections };
