import { Routes, Route } from "react-router-dom";
import { ResetMyInfo, ResetPassword } from "../../pages";

export default function ResetRoutes() {
  return (
    <Routes>
      <Route path="password" element={<ResetPassword />} />
      <Route path="myinfo" element={<ResetMyInfo />} />
    </Routes>
  );
}
