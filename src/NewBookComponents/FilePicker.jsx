const FilePicker = ({ handleFileChange, fileValidationMessage }) => {
  return (
    <div className="bg-red-200 py-2">
      <p className="p-2 text-xl">Image</p>
      <div className="mx-2 flex">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {fileValidationMessage && (
          <p
            className={`flex ml-2 justify-center w-4/12 ${
              fileValidationMessage === "File validated successfully!"
                ? " bg-green-400 border-2 border-black rounded-md"
                : " bg-red-500 border-2 border-black rounded-md"
            }`}
          >
            {fileValidationMessage}
          </p>
        )}
      </div>
    </div>
  );
};
export default FilePicker;
