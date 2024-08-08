import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import TimeOutDialog from "./TimeOutDialog";
import AuthorsDialog from "./AuthorsDialog";
import { useMutation } from "@apollo/client";
import useForm from "../hooks/useForm";
import {
  CREATE_BOOK,
  ALL_AUTHORS,
  AUTHOR_UPDATED,
  UPLOAD_BOOK_IMAGE,
} from "./queries";
const NewBook = ({ setToken, token }) => {
  const [bookInfo, handleChange, reset, addGenre, handleGenreDeletion] =
    useForm({
      title: "",
      author: "",
      published: 0,
      genre: "",
      genres: [],
    });

  // State for the error message and error animation
  // when the user tries to add a book with an invalid birthyear.
  const [playPubYearErrorAnimation, setPlayPubYearErrorAnimation] =
    useState(false);
  const [pubYearErrorMessage, setPubYearErrorMessage] = useState("");

  // State for the animation of the message box.
  const [isAnimating, setIsAnimating] = useState(false);

  // State for the message box and its style.
  const [message, setMessage] = useState({
    text: "Add a new book!",
    style: "py-2 bg-red-200 rounded mb-2 border-2 border-gray-400 text-center",
  });
  //This updated the apollo cache after a book is added.
  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });

  // Open or close state for the dialog box.
  const [dialogOpen, setDialogOpen] = useState(false);

  // State for the dialog box content.
  const [messageBoxContent, setMessageBoxContent] = useState("");

  // State for the duplicate genre error message.
  const [isDuplicateGenre, setIsDuplicateGenre] = useState(false);

  // State for the processing animation.
  const [isProcessing, setIsProcessing] = useState(false);

  //State for the iamge file of the book.
  const [file, setFile] = useState(null);

  //State for the Authors dialog.
  const [authorsDialogOpen, setAuthorsDialogOpen] = useState(false);
  //This is used to the listen for author updates and update the cache
  //for the authors correct bookCount after a book is added.
  const [uploadBookImage] = useMutation(UPLOAD_BOOK_IMAGE, {
    onError: (error) => {
      console.log("Error in uploading image");
      console.log(error);
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });
  //Reset the message after 5 seconds of adding a book.
  const resetMessage = () => {
    setTimeout(() => {
      setMessage({
        text: "Add a new book!",
        style:
          "p-2 bg-red-200 rounded mb-2 border-2 border-gray-400 text-center",
      });
    }, 5000);
  };

  const triggerAnimation = (status) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (!status) {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const handleError = (error) => {
    //Error handling for bad user inputs, network errors and token expiration.
    if (error.networkError) {
      const { code, result, extensions } = error.networkError;
      if (result && result.name === "TokenExpiredError") {
        setMessageBoxContent("You were timed out! Please log in again.");
        setDialogOpen(true);
      } else if (code === "DUPLICATE_BOOK_TITLE") {
        setMessage({
          text: "A book with the same title already exists!",
          style:
            "p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      } else if (code === "BAD_BOOK_GENRES") {
        setMessage({
          text: extensions.message,
          style:
            "p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      } else if (code === "NETWORK_ERROR") {
        setMessage({
          text: "A network error occurred. Please try again later.",
          style:
            " p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      }
    }
  };

  const handleBookSubmitConfirmation = (event) => {
    event.preventDefault();
    if (!file) {
      return <dialog></dialog>;
    } else {
      setIsProcessing(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };
  const handleBeforeInput = (event) => {
    const currentYear = new Date().getFullYear();
    const { data } = event;
    //If the input is not a number, prevent the default action and play the animation.
    if (!/^\d+$/.test(data)) {
      setPlayPubYearErrorAnimation(true);
      setPubYearErrorMessage("Only numbers are allowed.");
      event.preventDefault();
    } else if (currentYear < parseInt(data)) {
      setPlayPubYearErrorAnimation(true);
      setPubYearErrorMessage("The year cannot be in the future.");
    } else {
      setPlayPubYearErrorAnimation(false);
    }
  };
  //Useeffect to listen for author updates and update the cache.
  useEffect(() => {
    if (!token) {
      setDialogOpen(true);
      setMessageBoxContent(
        "Please log in to add a book. Or continue as a guest."
      );
    }
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: AUTHOR_UPDATED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedAuthor = subscriptionData.data.authorUpdated;

        return {
          allAuthors: prev.allAuthors.map((author) =>
            author.name === updatedAuthor.name ? updatedAuthor : author
          ),
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, token]);

  //useEffect to listen for the published year and check if it is valid.
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
      errorMsg = "Publsh year cannot be in the future";
      shouldPlayAnimation = true;
    } else if (bookInfo.published < 0) {
      errorMsg = "Publish year cannot be negative";
      shouldPlayAnimation = true;
    }
    setPlayPubYearErrorAnimation(shouldPlayAnimation);
    setPubYearErrorMessage(errorMsg);
  }, [bookInfo.published]);

  //Mutation to add a new book
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      setTimeout(() => {
        triggerAnimation(false);
        handleError(error);
      }, 1000);
    },
    onCompleted: (data) => {
      reset();
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      setTimeout(() => {
        triggerAnimation(true);
        setMessage({
          text: `${data.addBook.title} by ${data.addBook.author.name} was added succesfully!`,
          style:
            " p-2 bg-green-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
      }, 1000);
      resetMessage();
      return data.addBook;
    },

    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();
    //Add the book and wait for the response for information about the book.
    const addedBookData = await addBook({
      variables: {
        title: bookInfo.title,
        author: bookInfo.author,
        published: parseInt(bookInfo.published),
        genres: bookInfo.genres,
      },
    });
    console.log(addedBookData.data.addBook);
    //Try to upload the image after the book has been added.
    try {
      const bookId = addedBookData.data.addBook.id;
      const { data } = await uploadBookImage({
        variables: { file, bookId },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Must be rendered like this to prevent re-rendering on every key press.
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
            pubYearErrorMessage={pubYearErrorMessage}
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
const InputField = ({ label, name, value, onChange, type }) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400">
    <p> {label}</p>
    <input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
    />
  </div>
);
const AuthorInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  authorsDialogOpen,
  setAuthorsDialogOpen,
}) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400">
    <p> {label}</p>
    <button
      className="border-black border-2 bg-gray-300 rounded-md p-2"
      type="button"
      onClick={() => {
        setAuthorsDialogOpen(true);
      }}
    >
      Select an existing author
    </button>
    <input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
    />
    <AuthorsDialog open={authorsDialogOpen} />
  </div>
);
const PubYearInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  pattern,
  inputMode,
  maxlength,
  onBeforeInput,
  playPubYearErrorAnimation,
  pubYearErrorMessage,
}) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400 relative">
    <p> {label}</p>
    <p
      className={`${
        playPubYearErrorAnimation
          ? "absolute right-2 border-2 border-red-500 bg-red-300 rounded-md transition duration-500 transform translate-y-8 opacity-100"
          : "absolute right-3 border-2 rounded-md transition duration-500 transform translate-y-0 opacity-0"
      }`}
    >
      {pubYearErrorMessage}
    </p>
    <input
      autoComplete="off"
      label={label}
      maxLength={maxlength}
      pattern={pattern}
      name={name}
      inputMode={inputMode}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
      onBeforeInput={onBeforeInput}
    />
  </div>
);
const GenreInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  isDuplicateGenre,
}) => (
  <div className="flex my-2 justify-between p-2 ">
    <label
      for="genresInput"
      className={`absolute ${
        isDuplicateGenre
          ? "duration-500 transform -translate-y-6 opacity-100 text-red-700"
          : "duration-500 transform -translate-y-6 opacity-0 fill-mode-forwards"
      }`}
    >
      {label}
    </label>
    <input
      className={`${
        isDuplicateGenre
          ? "border-2 border-red-500 outline-none   transition duration-300"
          : "border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      }`}
      id="genresInput"
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);
const AddBookButton = ({ type, bookInfo, setIsProcessing, file }) => {
  let isDisabled =
    bookInfo.title === "" ||
    bookInfo.author === "" ||
    bookInfo.published === 0 ||
    bookInfo.genres.length === 0;

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
const AddGenreButton = ({
  addGenre,
  genre,
  genres,
  isDuplicateGenre,
  setIsDuplicateGenre,
}) => {
  //Ekaks tsekataan onko genre tyhjä, onko genre jo listassa ja onko genrejä max määrä.
  const isGenreEmpty = genre === "";
  const isGenreDuplicate =
    genres.includes(genre.toLowerCase()) || isDuplicateGenre;
  const isGenreMax = genres.length >= 3;
  //Sitten asetetaan duplikaattimuuttujan tila.
  setIsDuplicateGenre(isGenreDuplicate);
  //Lopuksi tarkistetaan onko nappi disabloitu.
  const isDisabled = isGenreEmpty || isGenreDuplicate || isGenreMax;
  return (
    <button
      className="addGenreButton"
      onClick={isDisabled ? null : addGenre}
      disabled={isDisabled}
    >
      Add genre. Max 3.
    </button>
  );
};

//Show a message to the user when the book is being added. Or an loading circle.
const InfoBox = ({ isAnimating, isProcessing, message }) => {
  return (
    <div
      className={`${message.style} ${
        isAnimating ? "animate-scaleUpAndDown" : ""
      }`}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-6 w-6 mx-4 text-red-400 fill-red-600"
            viewBox="0 0 101 101"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <p className="w-full break-words">{message.text}</p>
      )}
    </div>
  );
};
const GenresBox = ({ genres, handleGenreDeletion }) => {
  return (
    <div className="flex relative border-b-2 border-gray-400  bg-red-200 ">
      <label className="absolute -top-4 left-2 bg-red-200">Genres</label>
      <div className="w-full  break-words">
        <ul className="flex flex-wrap my-2">
          {genres.map((genre, index) => (
            <li
              key={index}
              className="relative rounded-md border-white border-2 w-min p-1 m-1 text-center hover:bg-red-400 hover:text-white transition duration-300 ease-linear transform hover:scale-110"
            >
              {genre}
              <button
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                onClick={() => handleGenreDeletion(genre)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
const FilePicker = ({ setFile, handleFileChange }) => {
  return (
    <div className="bg-red-200">
      <p className="p-2">Image</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};
const BookAddConfirmation = () => {
  return (
    <div className="border-2 border-red-400 rounded-md">
      <header>
        Are you sure you want to add this book withouth a picture?
      </header>
      <button className="bg-green-300">Confirm</button>
      <button className="bg-red-300">Cancel</button>
    </div>
  );
};

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
  playPubYearErrorAnimation,
  pubYearErrorMessage,
  authorsDialogOpen,
  setAuthorsDialogOpen,
}) => (
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

export default NewBook;
