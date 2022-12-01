function Input({
  register,
  id,
  type,
  message,
  disabled,
  placeholder,
  defaultValue,
}) {
  return (
    <input
      {...register(`${id}`, { required: `${message}(이)가 누락됐습니다` })}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-8 pb-0.5 border-b-2 border-black bg-transparent text-slate-800 focus:outline-none focus:border-b-[3px] tablet:pb-1 tablet:px-10"
    />
  );
}

export { Input };
