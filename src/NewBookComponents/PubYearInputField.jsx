const PubYearInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  pattern,
  inputMode,
  maxlength,
  onBeforeInput,
  playPubYearErrorAnimation,
  pubYearErrorMessage,
}) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400 relative">
    <p> {label}</p>
    <p
      className={`${
        playPubYearErrorAnimation
          ? "absolute right-2 border-2 border-red-500 bg-red-300 rounded-md transition duration-500 transform translate-y-8 opacity-100"
          : "absolute right-3 border-2 rounded-md transition duration-500 transform translate-y-0 opacity-0"
      }`}
    >
      {pubYearErrorMessage}
    </p>
    <input
      autoComplete="off"
      label={label}
      maxLength={maxlength}
      pattern={pattern}
      name={name}
      inputMode={inputMode}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
      onBeforeInput={onBeforeInput}
    />
  </div>
);
export default PubYearInputField;
