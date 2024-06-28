import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import TimeOutDialog from "./TimeOutDialog";
import { useMutation } from "@apollo/client";
import useForm from "../hooks/useForm";
import { CREATE_BOOK, ALL_AUTHORS, AUTHOR_UPDATED } from "./queries";
const NewBook = ({ setToken, token }) => {
  const [bookInfo, handleChange, reset, addGenre] = useForm({
    title: "",
    author: "",
    published: 0,
    genre: "",
    genres: [],
  });
  /*const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");*/
  // const [genre, setGenre] = useState("");
  //const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("Add a new book!");
  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDuplicateGenre, setIsDuplicateGenre] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  //This is used to the listen for author updates and update the cache
  //for the authors correct bookCount after a book is added.

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
    triggerAnimation(false);
    //Error handling for network errors and token expiration.
    if (error.networkError) {
      const { code, result } = error.networkError;
      if (result && result.name === "TokenExpiredError") {
        setMessageBoxContent("You were timed out! Please log in again.");
        setDialogOpen(true);
      } else if (code === "DUPLICATE_BOOK_TITLE") {
        setMessage(
          "Adding a book failed! A book with the same title already exists."
        );
      } else if (code === "NETWORK_ERROR") {
        setMessage(
          "A network error has occured while fetching data. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
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
      /*unsubscribeNewGenres();*/
    };
  }, [subscribeToMore]);

  //Mutation to add a new book
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log("OLEN ERRORISSA, JA TÄSSÄ SE ERRORI ON:", { error });
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
      handleError(error);
    },
    onCompleted: () => {
      triggerAnimation(true);
      setMessage("Book added successfully!");
    },

    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: {
        title: bookInfo.title,
        author: bookInfo.author,
        published: parseInt(bookInfo.published),
        genres: bookInfo.genres,
      },
    });
    reset();
  };

  //Must be rendered like this to prevent re-rendering on every key press.
  return (
    <div className="flex">
      {token ? (
        <>
          <TimeOutDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            errorMessage={messageBoxContent}
            setToken={setToken}
          ></TimeOutDialog>
          <LoginView
            bookInfo={bookInfo}
            handleChange={handleChange}
            handleSubmit={submit}
            message={message}
            isAnimating={isAnimating}
            addGenre={addGenre}
            isDuplicateGenre={isDuplicateGenre}
            setIsDuplicateGenre={setIsDuplicateGenre}
          />
        </>
      ) : (
        <div>Yuo were logged out</div>
      )}
    </div>
  );
};
const InputField = ({ label, name, value, onChange, type, validInput }) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400">
    <p> {label}</p>
    <input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2 border-b-solid border-b-black"
      value={value}
      onChange={onChange}
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
      {" "}
      {label}
    </label>
    <input
      className={`${
        isDuplicateGenre
          ? "border-transparent  border-red-500 outline-none ring-2 ring-red-500  transition duration-300"
          : ""
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
const AddBookButton = ({ type, bookInfo }) => {
  if (
    bookInfo.title === "" ||
    bookInfo.author === "" ||
    bookInfo.published === 0 ||
    bookInfo.genres.length === 0
  ) {
    return (
      <button className="addBookButton" type={type} disabled>
        Add book
      </button>
    );
  } else {
    return (
      <button className="addBookButton" type={type}>
        Add book
      </button>
    );
  }
};
const AddGenreButton = ({
  addGenre,
  genre,
  genres,
  isDuplicateGenre,
  setIsDuplicateGenre,
}) => {
  if (genre === "") {
    setIsDuplicateGenre(false);
    return (
      <button className="addGenreButton" disabled>
        <p>Add genre</p>
      </button>
    );
  } else if (genres.includes(genre.toLowerCase()) || isDuplicateGenre) {
    setIsDuplicateGenre(true);
    return (
      <button className="addGenreButton bg-red-400 " disabled>
        <p>Add genre</p>
      </button>
    );
  } else {
    setIsDuplicateGenre(false);
    return (
      <button className="addGenreButton" onClick={addGenre}>
        <p>Add genre</p>
      </button>
    );
  }
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
}) => (
  <div className="flex flex-col w-full flex-grow-0 justify-end">
    <div
      className={` 
  w-full border-gray-400 border-2 rounded-md text-center bg-red-200 my-2 py-4 ${
    isAnimating ? "animate-scaleUpAndDown bg-red-400" : ""
  }`}
    >
      {message}
    </div>
    <h2 className="text-xl">Add a new book!</h2>
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
        <InputField
          name="author"
          label="Author:"
          type="text"
          value={bookInfo.author}
          onChange={handleChange}
        />
        <InputField
          label="Published:"
          name="published"
          type="number"
          value={bookInfo.published}
          onChange={handleChange}
        />
        <div className="flex justify-between border-b-2 border-gray-200 pl-1 bg-red-200">
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
            onChange={handleChange}
            isDuplicateGenre={isDuplicateGenre}
          />
        </div>
      </div>
      <div className=" border-b-2 border-gray-200 p-2 bg-red-200">
        <span>Genres: {bookInfo.genres.join(" ")}</span>
      </div>
      <AddBookButton type={"submit"} bookInfo={bookInfo} />
    </form>
  </div>
);

export default NewBook;
