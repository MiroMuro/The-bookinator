const InputField = ({ label, name, value, onChange, type }) => (
  <div className="flex my-2  justify-between border-b-2 p-2 border-b-gray-400">
    <p className="text-xl"> {label}</p>
    <input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2 w-60 border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
    />
  </div>
);
export default InputField;
