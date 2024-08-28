import PropTypes from "prop-types";
const InputField = ({ label, name, value, onChange, type }) => (
  <div className="my-2 flex justify-between border-b-2 border-b-gray-400 p-2">
    <p className="text-xl"> {label}</p>
    <textarea
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="h-40 w-60 border-2 border-x-gray-200  border-b-black border-t-gray-200"
      value={value}
      onChange={onChange}
      placeholder="Enter a description for this book. Max 600 characters."
    />
  </div>
);
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
export default InputField;
