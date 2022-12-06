function VerifyBtns({ btns, verifyHandler, disabled, setValue }) {
  return (
    btns && (
      <div className="flex items-center space-x-3 absolute right-3 -top-0.5 tablet:space-x-5 desktop:space-x-10">
        <div className="cursor-pointer hover:scale-110" onClick={verifyHandler}>
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <div
          onClick={() => !disabled && setValue("email", "")}
          className="cursor-pointer"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    )
  );
}

export { VerifyBtns };
