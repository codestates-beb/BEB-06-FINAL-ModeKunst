// collections(좋아요한 게시물)
// {id⭕️, image_1⭕️, title⭕️, content, category⭕️, views⭕️, createdAt, UserNickname⭕️}
import { Link } from "react-router-dom";

export default function CardPost({ post, section }) {
    return (
        <div className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer">

            <Link to={`/post/${post.id}`}>
                <img
                    alt="post_image"
                    src={post.image_1}
                    className="object-contain rounded-lg shadow-xl block"
                />
            </Link>

            <div className="py-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg">
                {section === "hotposts" ? (
                    <div className="px-2 flex justify-around items-center font-medium text-slate-200">
                        <span className="text-sm">{post.title}</span>
                        <div className="text-xs flex flex-col">
                            <div>
                                <span>{post.createdAt} </span>
                                <div className="space-x-2">
                                    <span>카테고리 :{post.category}</span>
                                    <span>likes: {post.likes_num}</span>
                                    <span>views: {post.views}</span>
                                    <span>reviews: {post.reviews_num}</span>
                                    <span>{post.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :  (
                    <div className="px-2 flex justify-around items-center font-medium text-slate-200">
                        <img
                            src={post.profile_img}
                            className="w-5 h-5 object-cover bg-slate-200 shadow-lg rounded-full"
                        />
                        <span>닉네임: {post.UserNickname}</span>
                        <span className="text-sm">{post.title}</span>
                        <div className="text-xs flex flex-col">
                            <span>카테고리 :{post.category}</span>
                            <span>likes: {post.likes_num}</span>
                            <span>views: {post.views}</span>
                            <span>reviews: {post.reviews_num}</span>
                            <span>{post.createdAt}</span>
                        </div>
                    </div>
                ) }
            </div>
        </div>
    );
}
