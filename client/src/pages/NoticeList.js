import { useState, useEffect } from "react";
import axios from "axios";
import TablePage from "../components/common/Pagination/TablePage";
import { useSelector } from "react-redux";

function NoticeList() {
  // redux 관리자 정보
  const userInfo = useSelector(state => state.user);
  const { isAdmin, nickname: adminNickname } = useSelector(
    state => state.admin
  );

  // 공지 상태관리
  const [notice, setNotice] = useState([]);

  // 공지 및 래플 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/admin/notice`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.notices;
        setNotice(data);
      })
      .catch(e => {
        console.error(e);
      });
  }, []);

  console.log(notice);

  return (
    <div className="h-full space-y-10 items-center flex flex-col ">
      <div className="mt-40 text-center font-title text-3xl">
        Notice & Raffle
      </div>
      <div className="self-center w-4/5 bg-slate-100 rounded-md text-center px-10 py-6 drop-shadow-sm">
        <div className="space-y-5 flex flex-col items-center">
          <table className="table-fixed">
            <thead>
              <tr>
                {/* <th className="w-screen h-fit text-lg font-title">번호</th> */}
                {/* <th className="w-80 h-10 text-lg font-title">제목</th>
                <th className="w-15 h-10 text-lg font-title">작성자</th> */}
              </tr>
            </thead>
            <tbody>
              <TablePage arr={notice} section="notice" />
            </tbody>
          </table>
        </div>
      </div>
      <div className="m-64" />
    </div>
  );
}

export { NoticeList };
