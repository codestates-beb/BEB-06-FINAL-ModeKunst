function NicknameChecked({
  checked,
  setValue,
  setChecked,
  setDisabled,
  checkHandler,
}) {
  return checked ? (
    // 닉네임 체크 완료 -> 닉네임 바꾸기 버튼 표시
    <div
      onClick={() => {
        setValue("nickname", "");
        setChecked(false);
        setDisabled(false);
      }}
      className="inline-block absolute right-3 top-1 cursor-pointer"
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </div>
  ) : (
    // 닉네임 체크 미완료 -> 닉네임 체크 버튼 & 닉네임 입력값 삭제 버튼 표시
    <div className="flex items-center space-x-3 absolute right-3 -top-0.5 tablet:space-x-5 desktop:space-x-10">
      <div className="cursor-pointer hover:scale-110" onClick={checkHandler}>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div
        onClick={() => {
          setValue("nickname", "");
        }}
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
  );
}
export { NicknameChecked };
