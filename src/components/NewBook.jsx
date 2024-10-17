import TimeOutDialog from "./TimeOutDialog";
import useBookForm from "../hooks/useBookForm";
import LoginView from "../NewBookComponents/LoginView";
import PropTypes from "prop-types";
const NewBook = ({ setToken, token }) => {
  const {
    bookInfo,
    playPubYearErrorAnimation,
    setPlayPubYearErrorAnimation,
    pubYearErrorMessage,
    setPubYearErrorMessage,
    isAnimating,
    message,
    dialogOpen,
    setDialogOpen,
    messageBoxContent,
    isDuplicateGenre,
    setIsDuplicateGenre,
    isProcessing,
    setIsProcessing,
    file,
    setFile,
    authorsDialogOpen,
    setAuthorsDialogOpen,
    handleChange,
    addGenre,
    handleGenreDeletion,
    handleBeforeInput,
    handleFileChange,
    submit,
    setAuthor,
    addAuthorDialogOpen,
    setAddAuthorDialogOpen,
    isTooLongGenre,
    setIsTooLongGenre,
    fileValidationMessage,
    setFileValidationMessage,
  } = useBookForm(token, setToken);

  return (
    <div className="w-10/12 mx-auto pt-2 sm:w-8/12 sm:mx-auto md:w-8/12 lg:w-10/12">
      {token ? (
        <>
          <TimeOutDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            errorMessage={messageBoxContent}
            setToken={setToken}
          ></TimeOutDialog>
          <LoginView
            authorsDialogOpen={authorsDialogOpen}
            bookInfo={bookInfo}
            handleChange={handleChange}
            handleSubmit={submit}
            message={message}
            isAnimating={isAnimating}
            addGenre={addGenre}
            isDuplicateGenre={isDuplicateGenre}
            setIsDuplicateGenre={setIsDuplicateGenre}
            setIsProcessing={setIsProcessing}
            isProcessing={isProcessing}
            handleGenreDeletion={handleGenreDeletion}
            setFile={setFile}
            handleFileChange={handleFileChange}
            handleBeforeInput={handleBeforeInput}
            playPubYearErrorAnimation={playPubYearErrorAnimation}
            setPlayPubYearErrorAnimation={setPlayPubYearErrorAnimation}
            pubYearErrorMessage={pubYearErrorMessage}
            setPubYearErrorMessage={setPubYearErrorMessage}
            file={file}
            setAuthorsDialogOpen={setAuthorsDialogOpen}
            setAuthor={setAuthor}
            addAuthorDialogOpen={addAuthorDialogOpen}
            setAddAuthorDialogOpen={setAddAuthorDialogOpen}
            isTooLongGenre={isTooLongGenre}
            setIsTooLongGenre={setIsTooLongGenre}
            fileValidationMessage={fileValidationMessage}
            setFileValidationMessage={setFileValidationMessage}
          />
        </>
      ) : (
        <TimeOutDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          errorMessage={"Please log in to add a book. Or continue as a guest."}
          setToken={setToken}
        ></TimeOutDialog>
      )}
    </div>
  );
};
NewBook.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default NewBook;
