import React from "react";
import PropTypes from "prop-types"; // Add this line to import PropTypes

const AddBookButton = ({ type, bookInfo, setIsProcessing }) => {
  let isDisabled =
    bookInfo.title === "" ||
    bookInfo.author === "" ||
    bookInfo.published === 0 ||
    bookInfo.genres.length === 0;

  return (
    <div className="flex justify-center">
      <button
        data-test="add-book-button"
        className="addBookButton"
        type={type}
        disabled={isDisabled}
        onClick={() => setIsProcessing(true)}
      >
        Add book
      </button>
    </div>
  );
};

// Add prop validation for the 'type' prop
AddBookButton.propTypes = {
  type: PropTypes.string.isRequired,
  bookInfo: PropTypes.object.isRequired,
  setIsProcessing: PropTypes.func.isRequired,
};

export default AddBookButton;
