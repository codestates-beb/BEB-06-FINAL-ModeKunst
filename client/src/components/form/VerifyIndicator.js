function VerifyIndicator({ isVerified }) {
  return !isVerified ? (
    <div className="absolute pb-0.5 left-2 flex justify-center items-center text-xs text-red-500 font-medium rounded-full">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 tablet:w-6 tablet:h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ) : (
    <div className="flex justify-center items-center text-xs text-green-500 font-medium rounded-full">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 tablet:w-6 tablet:h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

export { VerifyIndicator };
