import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 마이페이지에서 nested routes 링크 이동하면 불필요하게 위로 스크롤 되는 현상 방지
    if (!pathname.includes("user")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
}
