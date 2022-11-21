import { Route, Routes, useParams } from "react-router-dom";
import { Collections, Followings, HotPosts, NftLists } from "../../pages";
import UserProfile from "../common/UserProfile";

export default function UserRoutes() {
  const { nickname } = useParams();

  return (
    <div>
      <UserProfile nickname={nickname} />

      <Routes>
        <Route path="hotposts" element={<HotPosts />} />
        <Route path="nfts" element={<NftLists />} />
        <Route path="collections" element={<Collections />} />
        <Route path="followings" element={<Followings />} />
      </Routes>
    </div>
  );
}
