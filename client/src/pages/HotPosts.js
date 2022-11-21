import hotpost from "../assets/hotpost.jpeg";
import CardPost from "../components/common/CardPost";
import {useLocation} from "react-router-dom";

function HotPosts() {

    const location = useLocation();

    const posts = location.state?.posts;
    const nickname = location.state?.nickname;
    return (
        <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
            <h1 className="text-2xl font-semibold"># {nickname} 님의 인기 게시물</h1>
            <div className="grid grid-cols-4 gap-8 w-full px-4 py-10">
                {/* 🟠 where data injected takes place */}
                {
                    posts
                    ?
                        posts.map((post, index) => (
                            <CardPost item={index} hotpost={post} />
                        ))
                    :
                        <div></div>
                }
            </div>
        </div>
    );
}

export { HotPosts };
