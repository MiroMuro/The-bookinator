import { ALL_BOOKS, BOOK_ADDED, ALL_AUTHORS } from "./queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import GenresDropdown from "./GenresDropdown";
import image from "../static/images/book.jpg";
import TimeOutDialog from "./TimeOutDialog";
const Books = ({ setToken }) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);
  const handleClose = () => setErrorDialogOpen(false);
  const { loading, error, data, subscribeToMore } = useQuery(ALL_BOOKS);
  const { loadingAuthors, errorAuthors, dataAuthors } = useQuery(ALL_AUTHORS);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: BOOK_ADDED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const prevGenres = subscriptionData.data.allBooks
          .map((book) => book.genres)
          .flat();
        const addedBookGenre = subscriptionData.data.bookAdded.genres;
        return {
          allGenres: prevGenres.concat(addedBookGenre),
        };
      },
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  const filterBooks = (books, currentGenre) => {
    if (currentGenre === "") {
      return books;
    } else {
      return books.filter((book) => book.genres.includes(currentGenre));
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (
    error &&
    (error.networkError?.result?.name === "TokenExpiredError" ||
      error.networkError?.result?.name === "JsonWebTokenError")
  ) {
    return (
      <TimeOutDialog
        open={errorDialogOpen}
        onClose={handleClose}
        errorMessage={error.networkError.result.messageForUser}
        setToken={setToken}
      />
    );
  }
  if (error)
    return <div>A netowrk error has occured. Please try again later.</div>;
  const BookGrid = ({ books }) => {
    if (books.length === 0) {
      return <div>No books added yet.</div>;
    } else {
      return (
        <div className="grid mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Cards go here*/}
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <header className=" bg-red-200 p-2  min-h-16">
                <h2 className="font-semibold break-normal text-lg mb-2 sm:text-sm md:text-base lg:text-sm">
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
                <p className="text-sm text-gray-600">
                  Published: {book.published}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  const books = data.allBooks;
  const filteredBooks = filterBooks(books, currentGenre);

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex w-full align-top  bg-white top-60 mt-4 sticky  sm:top-14">
        <div className="w-full bg-red-200 rounded-md border-2 mt-2  p-2 border-gray-400 ">
          <GenresDropdown
            setCurrentGenre={setCurrentGenre}
            currentGenre={currentGenre}
          />
        </div>
      </div>
      <div className="grid mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <BookGrid books={filteredBooks} />
      </div>
    </div>
  );
};

export default Books;
