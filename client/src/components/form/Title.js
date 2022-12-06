function Title({ title, title2 }) {
  return title ? (
    <label className="px-6 text-xl font-title font-semibold tablet:text-2xl">
      {title}
    </label>
  ) : (
    <label className="px-6 text-lg font-title font-semibold tablet:text-lg">
      {title2}
    </label>
  );
}

export { Title };
