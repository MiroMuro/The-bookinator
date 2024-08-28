import { useQuery } from "@apollo/client";
import { GET_USER, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BookImage from "./BookImage";
import TimeOutDialog from "./TimeOutDialog";
const Suggestions = ({ setToken }) => {
  const [messageBoxContent, setMessageBoxContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleError = (error) => {
    //Error handling for network errors and token expiration.
    if (error.networkError) {
      const { code, result } = error.networkError;
      if (result && result.name === "TokenExpiredError") {
        setMessageBoxContent("You were timed out! Please log in again.");
        setDialogOpen(true);
      } else if (code === "NETWORK_ERROR") {
        setMessageBoxContent(
          "A network error has occured while fetching data. Please try again later."
        );
      }
    }
  };

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER);

  const [favoriteGenre, setFavoriteGenre] = useState("");

  //Fetch the book image data.
  /*const {
    loadingImage: imageLoading,
    errorImage: imageError,
    dataImage: imageData,
  } = useQuery(GET_BOOK_IMAGE, {
    variables: { bookId },
  });*/

  //Fetch the user data and set the favorite genre.
  //Fetch books according to the favorite genre.
  useEffect(() => {
    if (!userLoading && userData) {
      setFavoriteGenre(userData.me.favoriteGenre);
    }
  }, [userLoading, userData]);
  //Fetch the books according to the favorite genre.
  //If the favorite genre is not present, do not fetch the books.
  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
    subscribeToMore,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  //Handle the different loading and error states
  useEffect(() => {
    if (userLoading || booksLoading) {
      setMessageBoxContent("Loading...");
    }
    if (booksError) {
      setMessageBoxContent("Error fetching books...");
    }
    if (userError) {
      handleError(userError);
    }

    if (favoriteGenre) {
      setMessageBoxContent(
        "Book suggestions for your favourite genre: " + favoriteGenre
      );
    }
  }, [userLoading, booksLoading, booksError, userError, favoriteGenre]);

  //Handle the subscription to listen for new books and update the cache.
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: BOOK_ADDED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        console.log("Subscription data", subscriptionData.data);
        console.log("Previous data", prev);
        if (!subscriptionData.data) return prev;
        const prevGenres = subscriptionData.data.allBooks
          .map((book) => book.genres)
          .flat();
        console.log("Previous genres", prevGenres);
        const addedBookGenre = subscriptionData.data.bookAdded.genres;
        console.log("Added book genre", addedBookGenre);
        return {
          allGenres: prevGenres.concat(addedBookGenre),
        };
      },
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);
  return (
    <>
      <TimeOutDialog
        open={dialogOpen}
        onClose={handleClose}
        errorMessage={messageBoxContent}
        setToken={setToken}
      ></TimeOutDialog>
      <div className="flex w-full flex-col sm:w-7/12">
        <div className="m-auto my-4 flex rounded-md border-2 border-red-400 bg-red-200  p-2">
          <h2>{messageBoxContent}</h2>
        </div>
        {booksData && (
          <div className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6 lg:px-6">
            <div className={`${booksData.allBooks.length < 1 ? "" : "hidden"}`}>
              <p>
                {booksData.length < 1 && console.log(booksData.allBooks)}
                No books in your favorite genre yet. <br />
                Go add some in the Add &quot;book&quot; tab!
              </p>
            </div>
            {/* Cards go here*/}
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {booksData.allBooks.map((book) => (
                <div
                  key={book.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                >
                  <header className="min-h-16 bg-red-200 p-2">
                    <h2 className="break-normal text-sm font-semibold">
                      {book.title}
                    </h2>
                  </header>
                  <div>
                    <BookImage bookId={book.id} />
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-sm text-gray-600">
                      Author: {book.author.name}
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      Born: {book.author.born}
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      Published: {book.published}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
Suggestions.propTypes = {
  setToken: PropTypes.func.isRequired,
};
export default Suggestions;
