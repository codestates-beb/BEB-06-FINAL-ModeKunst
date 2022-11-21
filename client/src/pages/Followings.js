// 🟠 useLocation 훅 사용해서 state로 전달한 데이터 받아오기
// 추후에 following 컴포넌트 따로 빼내도록 리팩토링

import {Link, useLocation} from "react-router-dom";

function Followings() {

    const location = useLocation();

    const followings = location.state?.followings;
    const nickname = location.state?.nickname;
    console.log(followings)
    return (
        <div className="max-w-6xl min-w-[900px] mx-auto px-20 py-20 mb-20 space-y-7 rounded-b-lg bg-slate-200 shadow-2xl">
            <h1 className="text-2xl font-semibold">
                # {nickname} 님이 팔로잉 하는 사람들
            </h1>
            <div className="grid grid-cols-4 gap-8 w-full px-4 py-10">
                {followings.map(item => (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-48 h-48 bg-slate-500 rounded-full shadow-md">
                            {/* 👇🏻 밑에 img 태그에 src 전달해야 함 */}
                            <Link to={`/user/${item.Following}`}><img src={item.profile_img} /></Link>
                        </div>
                        <div className="flex flex-col">
                            <span>{item.Following}</span>
                            <span className="text-xs">팔로워 수: {item.follow_amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Followings };
