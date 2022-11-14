import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Main,
  Signup,
  WritePost,
  ReadPost,
  User,
  NotFound,
} from "../pages";
import ForgotRoutes from "./routes/ForgotRoutes";
import ResetRoutes from "./routes/ResetRoutes";

export default function Router() {
  return (
    <BrowserRouter>
      {/* Header 컴포넌트 자리 */}
      <Routes>
        {/* 
        페이지 추가될 때마다 아래 Route 추가
        📍 총 페이지 10개
        👉🏻 완료 페이지: 메인, 회원가입, 로그인, 게시글작성, 게시글디테일, 유저페이지, 이메일찾기, 비밀번호찾기, 비밀번호수정, 내정보수정
        */}
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/post/:id" element={<ReadPost />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/forgot/*" element={<ForgotRoutes />} />
        <Route path="/reset/*" element={<ResetRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Footer 컴포넌트 자리 */}
    </BrowserRouter>
  );
}
