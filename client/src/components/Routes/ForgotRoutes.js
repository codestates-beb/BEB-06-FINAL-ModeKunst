import { Routes, Route } from "react-router-dom";
import { ForgotEmail, ForgotPassword } from "../../pages";

export default function ForgotRoutes() {
  return (
    <>
      <h1>내 정보 찾기</h1>
      <Routes>
        <Route path="email" element={<ForgotEmail />} />
        <Route path="password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}
