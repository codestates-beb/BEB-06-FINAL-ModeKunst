import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Main,
  Signup,
  WritePost,
  ReadPost,
  NotFound,
  Chat,
  UserHome,
  NftLists,
  Collections,
  Followings,
  Followers,
  Search,
} from "../pages";
import { AdminSignup, AdminLogin } from "../pages/admin";
import Header from "./common/Header";
import Footer from "./common/Footer";
import ForgotRoutes from "./Routes/ForgotRoutes";
import ResetRoutes from "./Routes/ResetRoutes";
import UserProfile from "./common/UserProfile";
import AdminRoutes from "./Routes/AdminRoutes";
import ScrollTop from "./common/ScrollTop";

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/post/:id" element={<ReadPost />} />
        <Route path="/user/:nickname/*" element={<UserProfile />}>
          <Route index element={<UserHome />} />
          <Route path="hotposts" element={<UserHome />} />
          <Route path="nfts" element={<NftLists />} />
          <Route path="collections" element={<Collections />} />
          <Route path="followings" element={<Followings />} />
          <Route path="followers" element={<Followers />} />
        </Route>
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/forgot/*" element={<ForgotRoutes />} />
        <Route path="/reset/*" element={<ResetRoutes />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/search/:name" element={<Search />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
