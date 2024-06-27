import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import GenresDropdown from "./GenresDropdown";
import image from "../static/images/book.jpg";
import TimeOutDialog from "./TimeOutDialog";
const Books = ({ setToken }) => {
  const [currentGenre, setCurrentGenre] = useState("");
  //const result = useQuery(ALL_BOOKS);
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);

  const handleClose = () => {
    setErrorDialogOpen(false);
  };

  const { loading, error, data, subscribeToMore } = useQuery(ALL_BOOKS);

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

  if (loading) {
    return <div>Loading books...</div>;
  } else if (
    //Triggered if login token has expired or is invalid. e.g user is timed out.
    error &&
    error.networkError.result.name ===
      ("TokenExpiredError" || "JsonWebTokenError")
  ) {
    return (
      <TimeOutDialog
        open={errorDialogOpen}
        onClose={handleClose}
        errorMessage={error.networkError.result.messageForUser}
        setToken={setToken}
      />
    );
  } else if (error) {
    return (
      <div>
        A network error occured while fetching the books. Please try again
        later.
      </div>
    );
  }
  const filteredBooks = () => {
    if (currentGenre === "") {
      console.log("No genre selected");
      return data.allBooks;
    } else {
      return data.allBooks.filter((book) => book.genres.includes(currentGenre));
    }
  };

  return (
    <div className="flex flex-col w-7/12">
      <div className="flex bg-red-200 rounded-md border-2 my-4 p-2 border-red-400  m-auto">
        <GenresDropdown
          setCurrentGenre={setCurrentGenre}
          currentGenre={currentGenre}
        />
      </div>

      <div className="flex flex-wrap bg-blue-50">
        {/* Cards go here*/}
        {filteredBooks().map((book) => (
          <div className="card">
            <img className="p-4" src={image} alt="book" />
            <div className="bookInfo">
              <div className="flex flex-col ">
                <span>
                  <strong>Title:</strong> {book.title}{" "}
                </span>
                <span>
                  <strong>Author:</strong> {book.author.name}{" "}
                </span>
                <span>
                  <strong>Author born:</strong> {book.author.born}{" "}
                </span>
                <span>
                  <strong>Published:</strong> {book.published}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
