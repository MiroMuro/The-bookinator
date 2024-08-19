import TimeOutDialog from "./TimeOutDialog";
import useBookForm from "../hooks/useBookForm";
import LoginView from "../NewBookComponents/LoginView";

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
    <div className="w-4/12 pt-2">
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

export default NewBook;
