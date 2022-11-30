function EraseContentBtn({ setValue, id }) {
  return (
    <div
      onClick={() => setValue(`${id}`, "")}
      className="inline-block absolute right-3 top-1 cursor-pointer"
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
  );
}

export { EraseContentBtn };
