export default function CardPost({ item, hotpost }) {
  return (
    <div
      key={item}
      className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer"
    >
      <img
        alt="hotpost_image"
        src={hotpost}
        className="object-contain rounded-lg shadow-xl block"
      />
      <div className="py-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg">
        <div className="px-2 flex items-center font-medium text-slate-200 space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full">
            {/* 👇🏻 밑에 img 태그 주석 해제 후, src 태그에 전달받은 이미지 넣어줘야 함 */}
            {/* <img alt="profile_image" /> */}
          </div>
          <span className="text-sm">Sample Title</span>
          <div className="text-xs flex flex-col">
            <span>5시간 전</span>
            <div className="space-x-2">
              <span>likes</span>
              <span>views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
