import { ALL_BOOKS } from "./queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import GenresDropdown from "./GenresDropdown";
import image from "../static/images/book.jpg";
const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const result = useQuery(ALL_BOOKS);

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: currentGenre },
  });

  if (result.loading || loading) {
    return <div>loading...</div>;
  }
  const filteredBooks = () => {
    if (currentGenre === "") {
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
