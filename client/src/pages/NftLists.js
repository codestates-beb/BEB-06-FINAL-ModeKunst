import LikesList from "../components/common/Pagination/LikesList";

function NftLists() {
  return (
    <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
      <h1 className="text-2xl font-semibold"> # 닉네임 님의 NFT 목록</h1>
      <LikesList />
    </div>
  );
}

export { NftLists };
