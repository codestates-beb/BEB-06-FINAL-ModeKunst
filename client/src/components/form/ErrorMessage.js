function ErrorMessage({ error }) {
  return (
    <span className="px-4 text-red-500 text-xs font-bold tablet:text-sm">
      {error?.message}
    </span>
  );
}
export { ErrorMessage };
