import { Routes, Route } from "react-router-dom";
import { ResetMyInfo, ResetPassword } from "../../pages";
import { ResetPost } from "../../pages/ResetPost";

export default function ResetRoutes() {
  return (
    <Routes>
      <Route path="password/:email" element={<ResetPassword />} />
      <Route path="myinfo" element={<ResetMyInfo />} />
      <Route path="post/:id" element={<ResetPost />} />
    </Routes>
  );
}
