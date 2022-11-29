function VerifyInputs({ verifyInput, setVerifyCode, verifyHandler }) {
  return (
    verifyInput && (
      <div className="px-4 flex space-x-2">
        <div className="px-2 flex justify-center items-center text-xs font-semibold text-slate-500 rounded-md">
          인증코드
        </div>
        <input
          type="text"
          onChange={e => setVerifyCode(e.target.value)}
          className="w-1/3 px-3 border-b-[1px] focus:border-b-2 border-b-slate-500 bg-transparent focus:outline-none text-xs text-slate-400 font-medium"
        />
        <div
          className="flex px-1 justify-center items-center w-5 h-5 text-slate-400 hover:text-white hover:bg-black rounded-full cursor-pointer"
          onClick={verifyHandler}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 tablet:w-4 tablet:h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
    )
  );
}

export { VerifyInputs };
