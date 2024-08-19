const FilePicker = ({ setFile, handleFileChange, fileValidationMessage }) => {
  return (
    <div className="bg-red-200">
      <p className="p-2 text-xl">Image</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {fileValidationMessage && (
        <p className="text-red text-xl text-red-500 p-2">
          ERROR! :{fileValidationMessage}
        </p>
      )}
    </div>
  );
};
export default FilePicker;
