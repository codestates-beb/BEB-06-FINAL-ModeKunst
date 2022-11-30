function Title({ title, title2 }) {
  return title ? (
    <label className="px-4 text-lg font-semibold tablet:text-2xl">
      {title}
    </label>
  ) : (
    <label className="px-4 text-md font-semibold tablet:text-lg">
      {title2}
    </label>
  );
}

export { Title };
