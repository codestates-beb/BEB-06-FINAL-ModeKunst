import { Routes, Route } from "react-router-dom";
import {
  BannerList,
  WriteBanner,
  ResetBanner,
  WriteNotice,
} from "../../pages/admin";

export default function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="banner" element={<BannerList />} />
        <Route path="writebanner" element={<WriteBanner />} />
        <Route path="resetbanner" element={<ResetBanner />} />
        <Route path="writenotice" element={<WriteNotice />} />
      </Routes>
    </>
  );
}
