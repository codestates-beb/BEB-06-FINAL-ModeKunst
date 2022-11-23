import hotpost from "../assets/hotpost.jpeg";
import CardPost from "../components/common/CardPost";

function HotPosts() {
  return (
    <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
      <h1 className="text-2xl font-semibold"># 닉네임 님의 인기 게시물</h1>
      <div className="grid grid-cols-4 gap-8 w-full px-4 py-10">
        {/* 🟠 where data injected takes place */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => (
          <CardPost item={item} hotpost={hotpost} />
        ))}
      </div>
    </div>
  );
}

export { HotPosts };