import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import TimeOutDialog from "./TimeOutDialog";
import { useMutation } from "@apollo/client";

import { CREATE_BOOK, ALL_AUTHORS, AUTHOR_UPDATED } from "./queries";
const NewBook = ({ setToken }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("Add a new book!");
  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
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
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div className="flex flex-col w-1/4 flex-grow-0 justify-end">
      <TimeOutDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        errorMessage={messageBoxContent}
        setToken={setToken}
      ></TimeOutDialog>
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
        onSubmit={submit}
      >
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Title
          <input
            minLength={2}
            required
            id="title"
            className="relative border-gray-400 border-2 mx-2 "
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Author
          <input
            minLength={4}
            required
            className="relative border-gray-400 border-2 mx-2 "
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className=" flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          Published
          <input
            required
            className="relative border-gray-400 border-2 mx-2 "
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="flex justify-between border-b-2 border-gray-200 p-2 bg-red-200">
          <button
            className="rounded-lg border-solid bg-white border-2 border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-200 scale-100 transform hover:scale-110"
            onClick={addGenre}
            type="button"
          >
            Add genre
          </button>
          <input
            className="relative border-gray-400 border-2 mx-2 "
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <div className=" border-b-2 border-gray-200 p-2 bg-red-200">
          <span>Genres: {genres.join(" ")}</span>
        </div>
        <div>
          <button
            className="flex flex-col ml-3 items-center rounded-lg w-1/2 border-solid border-2 text-center border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110"
            type="submit"
          >
            Create book
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBook;
