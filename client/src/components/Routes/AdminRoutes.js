import { Routes, Route } from "react-router-dom";
import {
  BannerList,
  WriteBanner,
  ResetBanner,
  WriteNotice,
  AdminMain,
  AdminReport,
  AdminNFT,
} from "../../pages/admin";

export default function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<AdminMain />} />
        <Route path="banner" element={<BannerList />} />
        <Route path="writebanner" element={<WriteBanner />} />
        <Route path="resetbanner/:bannerId" element={<ResetBanner />} />
        <Route path="writenotice" element={<WriteNotice />} />
        <Route path="report" element={<AdminReport />} />
        <Route path="nft" element={<AdminNFT />} />
      </Routes>
    </>
  );
}
