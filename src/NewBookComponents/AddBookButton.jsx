const AddBookButton = ({ type, bookInfo, setIsProcessing, file }) => {
  let isDisabled =
    bookInfo.title === "" ||
    bookInfo.author === "" ||
    bookInfo.published === 0 ||
    bookInfo.genres.length === 0;
  console.log("IS disabled? ", isDisabled);
  console.log("Bookinfo ", bookInfo);
  return (
    <button
      className="addBookButton"
      type={type}
      disabled={isDisabled}
      onClick={() => setIsProcessing(true)}
    >
      Add book
    </button>
  );
  /*}*/
};

export default AddBookButton;
