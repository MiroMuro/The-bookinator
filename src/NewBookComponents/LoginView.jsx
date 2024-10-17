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
import DescriptionField from "./DescriptionField";
import PropTypes from "prop-types";

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
  addAuthorDialogOpen,
  setAddAuthorDialogOpen,
  isTooLongGenre,
  setIsTooLongGenre,
  fileValidationMessage,
}) => {
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    let errorMsg = "";
    let shouldPlayAnimation = false;
    if (bookInfo.published.length > 4) {
      errorMsg = "Publish year must be 4 digits or less";
      shouldPlayAnimation = true;
    } else if (bookInfo.published > currentYear) {
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
    <div className="mr-auto flex w-full flex-col flex-wrap break-words px-8">
      <InfoBox
        isAnimating={isAnimating}
        isProcessing={isProcessing}
        message={message}
      />
      <form
        className="flex flex-col w-full rounded-md border-2 border-gray-400 lg:w-1/2 lg:mx-0 lg:mt-4 md:w-3/4 md:mr-auto md:mt-4 sm:w-11/12 sm:mx-auto sm:mt-4"
        onSubmit={handleSubmit}
      >
        <div className="bg-red-200">
          <InputField
            name="title"
            label="Title:"
            type="text"
            dataTest="titleInput"
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
            addAuthorDialogOpen={addAuthorDialogOpen}
            setAddAuthorDialogOpen={setAddAuthorDialogOpen}
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
          <DescriptionField
            name="description"
            label="Description:"
            type="text"
            value={bookInfo.description}
            onChange={handleChange}
          />
          <div className="flex flex-col justify-between  border-b-2 border-gray-400 bg-red-200 pb-2 pl-1">
            <div className="flex flex-row ">
              <p className="mt-2 w-4/12 px-1 text-xl">Genre:</p>
              <GenreInputField
                name="genre"
                type="text"
                value={bookInfo.genre}
                genres={bookInfo.genres}
                onChange={handleChange}
                isDuplicateGenre={isDuplicateGenre}
                isTooLongGenre={isTooLongGenre}
              />
            </div>
            <AddGenreButton
              addGenre={addGenre}
              genres={bookInfo.genres}
              genre={bookInfo.genre}
              setIsDuplicateGenre={setIsDuplicateGenre}
              setIsTooLongGenre={setIsTooLongGenre}
            />
          </div>
        </div>
        <GenresBox
          genres={bookInfo.genres}
          handleGenreDeletion={handleGenreDeletion}
        />
        <FilePicker
          handleFileChange={handleFileChange}
          setFile={setFile}
          fileValidationMessage={fileValidationMessage}
        />
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

LoginView.propTypes = {
  bookInfo: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  message: PropTypes.string,
  isAnimating: PropTypes.bool,
  addGenre: PropTypes.func,
  setIsDuplicateGenre: PropTypes.func,
  isDuplicateGenre: PropTypes.bool,
  isProcessing: PropTypes.bool,
  setIsProcessing: PropTypes.func,
  handleGenreDeletion: PropTypes.func,
  handleFileChange: PropTypes.func,
  handleBeforeInput: PropTypes.func,
  setFile: PropTypes.func,
  file: PropTypes.object,
  setPlayPubYearErrorAnimation: PropTypes.func,
  playPubYearErrorAnimation: PropTypes.bool,
  setPubYearErrorMessage: PropTypes.func,
  pubYearErrorMessage: PropTypes.string,
  authorsDialogOpen: PropTypes.bool,
  setAuthorsDialogOpen: PropTypes.func,
  setAuthor: PropTypes.func,
  addAuthorDialogOpen: PropTypes.bool,
  setAddAuthorDialogOpen: PropTypes.func,
  isTooLongGenre: PropTypes.bool,
  setIsTooLongGenre: PropTypes.func,
  fileValidationMessage: PropTypes.string,
};
export default LoginView;
