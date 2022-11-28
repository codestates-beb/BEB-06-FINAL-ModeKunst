import { Routes, Route } from "react-router-dom";
import { BannerList } from ".../pages/admin";

export default function AdminRoutes() {
  return (
    <>
      <h1>내 정보 찾기</h1>
      <Routes>
        <Route path="banner" element={<BannerList />} />
      </Routes>
    </>
  );
}
