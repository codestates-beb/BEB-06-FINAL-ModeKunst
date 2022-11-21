function Followers() {
  return (
    <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
      <h1 className="text-2xl font-semibold"># 닉네임 님의 팔로워들</h1>
      <div className="grid grid-cols-4 gap-8 w-full px-4 py-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-48 h-48 bg-slate-500 rounded-full shadow-md">
              {/* 👇🏻 밑에 img 태그에 src 전달해야 함 */}
              {/* <img src={} /> */}
            </div>
            <div className="flex flex-col">
              <span>닉네임</span>
              <span className="text-xs">팔로워 수</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Followers };
