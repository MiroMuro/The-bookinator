import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import GenresDropdown from "./GenresDropdown";
import image from "../static/images/book.jpg";
const Books = () => {
  const [currentGenre, setCurrentGenre] = useState("");
  const result = useQuery(ALL_BOOKS);

  const { loading, subscribeToMore } = useQuery(ALL_BOOKS, {
    variables: { genre: currentGenre },
  });

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

  if (result.loading || loading) {
    return <div>loading...</div>;
  }
  const filteredBooks = () => {
    if (currentGenre === "") {
      console.log("No genre selected");
      return result.data.allBooks;
    } else {
      return result.data.allBooks.filter((book) =>
        book.genres.includes(currentGenre)
      );
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
