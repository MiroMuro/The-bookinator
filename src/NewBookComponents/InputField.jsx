import PropTypes from "prop-types";

const InputField = ({ label, name, value, onChange, type, dataTest }) => (
  <div className="my-2 flex  justify-between border-b-2 border-b-gray-400 p-2 md:flex-col">
    <p className="text-xl"> {label}</p>
    <input
      data-test={dataTest}
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="w-60 border-2 border-x-gray-200  border-b-black border-t-gray-200"
      value={value}
      onChange={onChange}
    />
  </div>
);
InputField.propTypes = {
  dataTest: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
export default InputField;
