import { useQuery } from "@apollo/client";
import { GET_USER, ALL_BOOKS, BOOK_ADDED, GET_BOOK_IMAGE } from "./queries";
import image from "../static/images/book.jpg";
import BookImage from "./BookImage";
import { useEffect, useState } from "react";
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
      <div className="flex flex-col ww-full sm:w-7/12">
        <div className="flex bg-red-200 rounded-md border-2 my-4 p-2 border-red-400  m-auto">
          <h2>{messageBoxContent}</h2>
        </div>
        {booksData && (
          <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-6">
            <div className={`${booksData.allBooks.length < 1 ? "" : "hidden"}`}>
              <p>
                {booksData.length < 1 && console.log(booksData.allBooks)}
                No books in your favorite genre yet. <br />
                Go add some in the "Add book" tab!
              </p>
            </div>
            {/* Cards go here*/}
            <div className="grid mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {booksData.allBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <header className="bg-red-200 p-2 min-h-16">
                    <h2 className="font-semibold break-normal text-sm">
                      {book.title}
                    </h2>
                  </header>
                  <img
                    className="w-full h-46 object-cover"
                    src={image}
                    alt="book"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Author: {book.author.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Born: {book.author.born}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Published: {book.published}
                    </p>
                  </div>
                  <div>
                    <BookImage bookId={book.id} />
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
export default Suggestions;
