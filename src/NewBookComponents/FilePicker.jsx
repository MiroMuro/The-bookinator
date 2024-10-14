import PropTypes from "prop-types";

const FilePicker = ({ handleFileChange, fileValidationMessage }) => {
  return (
    <div className="bg-red-200 py-2">
      <p className="p-2 text-xl">Image</p>
      <div className="mx-2 flex">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          data-test="book-fileInput"
        />
        {fileValidationMessage && (
          <p
            data-test="book-file-validation-message"
            className={`ml-2 flex w-4/12 justify-center ${
              fileValidationMessage === "File validated successfully!"
                ? " rounded-md border-2 border-black bg-green-400"
                : " rounded-md border-2 border-black bg-red-500"
            }`}
          >
            {fileValidationMessage}
          </p>
        )}
      </div>
    </div>
  );
};
FilePicker.propTypes = {
  handleFileChange: PropTypes.func.isRequired,
  fileValidationMessage: PropTypes.string,
};
export default FilePicker;
