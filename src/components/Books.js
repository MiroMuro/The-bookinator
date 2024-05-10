import { ALL_BOOKS, ALL_GENRES } from "./queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
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

  const onGenreChange = async (event) => {
    event.preventDefault();
    refetch();
    console.log(data);
  };
  return (
    <div className="flex flex-wrap bg-blue-50  w-8/12 m-auto">
      {/* Cards go here*/}
      {data.allBooks.map((book) => (
        <div className="bg-red-200 m-8 shadow-md w-3/12 rounded-md overflow-hidden">
          <img className="p-4" src={image} alt="book" />
          <div className="flex justify-center">
            <div className="flex flex-col  border-2 border-black">
              <span>Title: </span>
              <span>Author: </span>
              <span>Author born: </span>
              <span>Published:</span>
            </div>
            <div className=" flex flex-col items-end  border-2 border-black">
              <span>{book.title}</span>
              <span>{book.author.name} </span>
              <span>{book.author.born} </span>
              <span>{book.published}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-red-200 m-8 shadow-md w-3/12 rounded-md overflow-hidden">
        <img className="p-4" src={image} alt="book" />
        <div className="flex justify-center">
          <div className="flex flex-col  border-2 border-black">
            <span>Title: </span>
            <span>Author: </span>
            <span>Author born: </span>
            <span>Published:</span>
          </div>
          <div className=" flex flex-col items-end  border-2 border-black">
            <span>Scary Book</span>
            <span>Pekka Haavistöö </span>
            <span>1959 </span>
            <span>2001</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
