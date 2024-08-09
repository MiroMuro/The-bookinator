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
  } = useBookForm(token, setToken);

  return (
    <div className="flex w-8/12">
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
