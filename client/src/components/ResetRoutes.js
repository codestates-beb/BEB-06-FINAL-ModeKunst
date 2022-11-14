import { Routes, Route } from "react-router-dom";
import { ResetMyInfo, ResetPassword } from "../pages";

export default function ResetRoutes() {
  return (
    <>
      <h1>내 정보 수정</h1>
      <Routes>
        <Route path="password" element={<ResetPassword />} />
        <Route path="myinfo" element={<ResetMyInfo />} />
      </Routes>
    </>
  );
}
