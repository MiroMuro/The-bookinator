import { ALL_BOOKS, ALL_GENRES } from "./queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import GenresDropdown from "./GenresDropdown";
import Genres from "./Genres";
import image from "../static/images/book.jpg";
const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const [currentBooks, setCurrentBooks] = useState([]);
  const result = useQuery(ALL_BOOKS);

  const genresResult = useQuery(ALL_GENRES);

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: currentGenre },
  });

  if (result.loading || loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div></div>
      <GenresDropdown
        genres={genresResult.data.allGenres}
        setCurrentGenre={setCurrentGenre}
      />
      <div className="flex flex-wrap bg-blue-50  w-8/12 m-auto">
        {/* Cards go here*/}
        {data.allBooks.map((book) => (
          <div className="card">
            <img className="p-4" src={image} alt="book" />
            <div className="bookInfo">
              <div className="flex flex-col ">
                <span>Title: </span>
                <span>Author: </span>
                <span>Author born: </span>
                <span>Published:</span>
              </div>
              <div className=" flex:1 flex-col items-end    ">
                <span>{book.title}</span>
                <span>{book.author.name} </span>
                <span>{book.author.born} </span>
                <span>{book.published}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="card">
          <img className="p-4" src={image} alt="book" />
          <div className="bookInfo">
            <div className="flex flex-col ">
              <span>Title: </span>
              <span>Author: </span>
              <span>Author born: </span>
              <span>Published:</span>
            </div>
            <div className=" flex flex-col items-end  ">
              <span>Scary Book</span>
              <span>Pekka Haavistöö </span>
              <span>1959 </span>
              <span>2001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
