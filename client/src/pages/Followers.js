import {useLocation, Link} from "react-router-dom";

function Followers() {
    const location = useLocation();

    const followers = location.state?.followers;
    const nickname = location.state?.nickname;
    console.log(followers[0])

    return (
        <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
            <h1 className="text-2xl font-semibold"># {nickname} 님의 팔로워들</h1>
            <div className="grid grid-cols-4 gap-8 w-full px-4 py-10">
                {followers.map(item => (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-48 h-48 bg-slate-500 rounded-full shadow-md">
                            {/* 👇🏻 밑에 img 태그에 src 전달해야 함 */}
                             <Link to={`/user/${item.Follower}`}><img src={item.profile_img} /></Link>
                        </div>
                        <div className="flex flex-col">
                            <span>{item.Follower}</span>
                            <span className="text-xs">팔로워 수: {item.follow_amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Followers };
