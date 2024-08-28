import PropTypes from "prop-types";

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
  <div className="relative my-2 flex justify-between border-b-2 border-b-gray-400 p-2 pb-8 ">
    <p className="text-xl"> {label}</p>
    <p
      className={`${
        playPubYearErrorAnimation
          ? "absolute right-2  translate-y-7 text-red-500 opacity-100 transition duration-500"
          : "absolute right-3 translate-y-0 rounded-md border-2 opacity-0 transition duration-500"
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
      className="w-60 border-2 border-x-gray-200  border-b-black border-t-gray-200"
      value={value}
      onChange={onChange}
      onBeforeInput={onBeforeInput}
    />
  </div>
);

PubYearInputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
  inputMode: PropTypes.string.isRequired,
  maxlength: PropTypes.number.isRequired,
  onBeforeInput: PropTypes.func.isRequired,
  playPubYearErrorAnimation: PropTypes.bool.isRequired,
  pubYearErrorMessage: PropTypes.string.isRequired,
};

export default PubYearInputField;
