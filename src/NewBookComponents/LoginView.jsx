import { useEffect } from "react";
import InputField from "./InputField";
import AuthorInputField from "./AuthorInputField";
import PubYearInputField from "./PubYearInputField";
import GenreInputField from "./GenreInputField";
import AddBookButton from "./AddBookButton";
import AddGenreButton from "./AddGenreButton";
import InfoBox from "./InfoBox";
import GenresBox from "./GenresBox";
import FilePicker from "./FilePicker";

const LoginView = ({
  bookInfo,
  handleChange,
  handleSubmit,
  message,
  isAnimating,
  addGenre,
  setIsDuplicateGenre,
  isDuplicateGenre,
  isProcessing,
  setIsProcessing,
  handleGenreDeletion,
  handleFileChange,
  handleBeforeInput,
  setFile,
  file,
  setPlayPubYearErrorAnimation,
  playPubYearErrorAnimation,
  setPubYearErrorMessage,
  pubYearErrorMessage,
  authorsDialogOpen,
  setAuthorsDialogOpen,
  setAuthor,
}) => {
  useEffect(() => {
    console.log("Book info", bookInfo.published);
    const currentYear = new Date().getFullYear();
    let errorMsg = "";
    let shouldPlayAnimation = false;
    if (!bookInfo.published) {
    } else if (bookInfo.published.length > 4) {
      errorMsg = "Publish year must be 4 digits or less";
      shouldPlayAnimation = true;
    } else if (bookInfo.published > currentYear) {
      console.log("Current year", currentYear);
      errorMsg = "Publish year cannot be in the future";
      shouldPlayAnimation = true;
    } else if (bookInfo.published < 0) {
      errorMsg = "Publish year cannot be negative";
      shouldPlayAnimation = true;
    }
    setPlayPubYearErrorAnimation(shouldPlayAnimation);
    setPubYearErrorMessage(errorMsg);
  }, [
    bookInfo.published,
    setPlayPubYearErrorAnimation,
    setPubYearErrorMessage,
  ]);

  return (
    <div className="flex flex-col w-5/12 mt-2 flex-wrap break-words">
      <InfoBox
        isAnimating={isAnimating}
        isProcessing={isProcessing}
        message={message}
      />

      <h2 className="text-xl w-5/12">Add a new book!</h2>
      <form
        className="flex flex-col border-gray-400 border-2 rounded-md overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="bg-red-200">
          <InputField
            name="title"
            label="Title:"
            type="text"
            value={bookInfo.title}
            onChange={handleChange}
          />
          <AuthorInputField
            name="author"
            label="Author:"
            type="text"
            value={bookInfo.author}
            onChange={handleChange}
            authorsDialogOpen={authorsDialogOpen}
            setAuthorsDialogOpen={setAuthorsDialogOpen}
            setAuthor={setAuthor}
          />
          <PubYearInputField
            label="Published:"
            name="published"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxlength={4}
            value={bookInfo.published}
            onChange={handleChange}
            onBeforeInput={handleBeforeInput}
            playPubYearErrorAnimation={playPubYearErrorAnimation}
            pubYearErrorMessage={pubYearErrorMessage}
          />
          <div className="flex justify-between border-b-2 overflow-hidden border-gray-400 pl-1 pb-2 bg-red-200">
            <AddGenreButton
              addGenre={addGenre}
              genres={bookInfo.genres}
              genre={bookInfo.genre}
              setIsDuplicateGenre={setIsDuplicateGenre}
            />
            <GenreInputField
              name="genre"
              type="text"
              label="Duplicate genre!"
              value={bookInfo.genre}
              genres={bookInfo.genres}
              onChange={handleChange}
              isDuplicateGenre={isDuplicateGenre}
            />
          </div>
        </div>
        <GenresBox
          genres={bookInfo.genres}
          handleGenreDeletion={handleGenreDeletion}
        />
        <FilePicker handleFileChange={handleFileChange} setFile={setFile} />
        <AddBookButton
          type={"submit"}
          bookInfo={bookInfo}
          setIsProcessing={setIsProcessing}
          file={file}
        />
      </form>
    </div>
  );
};
export default LoginView;
