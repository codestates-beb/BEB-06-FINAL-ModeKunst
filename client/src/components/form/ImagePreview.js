function ImagePreview({ image, imageHandler }) {
  return (
    <div className="relative">
      <img
        src={image}
        alt="profile_image_preview"
        className="w-48 h-48 object-cover rounded-full shadow-lg tablet:w-64 tablet:h-64 desktop:w-72 desktop:h-72"
      />
      <button
        onClick={() => imageHandler("")}
        className="absolute -top-1 -right-1 w-5 h-5 flex justify-center items-center bg-black text-white hover:bg-yellow-500 rounded-full tablet:w-6 tablet:h-6"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export { ImagePreview };
