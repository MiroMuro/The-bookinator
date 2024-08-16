const FilePicker = ({ setFile, handleFileChange }) => {
  return (
    <div className="bg-red-200">
      <p className="p-2 text-xl">Image</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};
export default FilePicker;
