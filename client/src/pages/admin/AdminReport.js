import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TablePage from "../../components/common/Pagination/TablePage";

function AdminReport() {
  //🟠report 상태관리
  const [report, setReport] = useState([]);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  // 공지 및 래플 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/report", {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.reports;
        setReport(data.filter(item => item.report_count !== 0));
        console.log(data);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <div className="h-full flex flex-col items-center space-y-8">
        <h1 className="mt-48 font-title text-3xl text-center">신고 관리</h1>
        <div className="flex flex-col w-4/5 space-y-5  items-center text-center p-10 bg-slate-50 rounded-xl border border-black shadow-xl">
          <div className="space-y-5 flex flex-col items-center">
            <table className="table-fixed">
              <tr>
                <th className="w-44 h-10 text-lg font-title">번호</th>
                <th className="w-44 h-10 text-lg font-title">닉네임</th>
                <th className="w-48 h-10 text-lg font-title">신고 누적 횟수</th>
                <th className="w-36 h-10 text-lg font-title text-transparent">
                  조치
                </th>
              </tr>
            </table>
            <table className="table-fixed">
              <tbody>
                <TablePage arr={report} section="report" />
              </tbody>
            </table>
          </div>
        </div>
        {modal && <div className="h-full w-full bg-black opacity-50"></div>}
        <div className="mb-48" />
      </div>
    </div>
  );
}

export { AdminReport };
