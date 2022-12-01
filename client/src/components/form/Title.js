function Title({ title, title2 }) {
  return title ? (
    <label className="px-6 text-lg font-semibold tablet:text-2xl">
      {title}
    </label>
  ) : (
    <label className="px-6 text-md font-semibold tablet:text-lg">
      {title2}
    </label>
  );
}

export { Title };
