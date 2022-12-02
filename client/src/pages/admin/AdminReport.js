function AdminReport() {
  const dummyData = [
    { nickname: "harriet", count_report: 2 },
    { nickname: "jin", count_report: 3 },
    { nickname: "jason", count_report: 2 },
    { nickname: "yan", count_report: 1 },
    { nickname: "macaron", count_report: 4 },
    { nickname: "latte", count_report: 2 },
    { nickname: "mott", count_report: 3 },
    { nickname: "mode", count_report: 5 },
  ];

  return (
    <div className="h-full flex flex-col items-center space-y-8">
      <h1 className="mt-48 font-title text-3xl text-center">신고 관리</h1>
      <div className="flex flex-col w-4/5 space-y-5  items-center text-center p-10 bg-slate-50 rounded-xl border border-black shadow-xl">
        <div className="space-y-5 flex flex-col items-center">
          <table className="table-fixed">
            <thead className="border-b border-gray-400">
              <tr>
                <th className="w-15 h-10 text-lg font-title">번호</th>
                <th className="w-80 h-10 text-lg font-title">닉네임</th>
                <th className="w-15 h-10 text-lg font-title">신고 횟수</th>
                <th className="w-15 h-10 text-lg font-title"></th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((item, idx) => (
                <tr>
                  <td className="h-16 font-title">{idx + 1}</td>
                  <td className="font-content font-light hover:font-extrabold cursor-pointer">
                    {item.nickname}
                  </td>
                  <td className="font-content font-light">
                    {item.count_report}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-48" />
    </div>
  );
}

export { AdminReport };
