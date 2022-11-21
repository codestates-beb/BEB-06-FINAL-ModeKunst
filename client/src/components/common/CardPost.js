import {Link} from "react-router-dom";

export default function CardPost({ item, hotpost }) {
  console.log(hotpost);
  return (
    <div
      key={item}
      className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer"
    >
      <Link to={`/post/${hotpost.id}`}>
        <img
            alt="hotpost_image"
            src={hotpost.image_1}
            className="object-contain rounded-lg shadow-xl block"
        />
      </Link>
      <div className="py-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg">
        <div className="px-2 flex items-center font-medium text-slate-200 space-x-2">

          <span className="text-sm">{hotpost.title}</span>
          <div className="text-xs flex flex-col">
            <span>{hotpost.createdAt} </span>
            <div className="space-x-2">
              <span>likes</span>
              <span>views: {hotpost.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
