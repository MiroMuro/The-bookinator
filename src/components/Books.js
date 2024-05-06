import { ALL_BOOKS, ALL_GENRES } from "./queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

import Genres from "./Genres";
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
  console.log(data.allBooks);
  const books = result.data.allBooks;
  return (
    <div>
      <h2>books</h2>
      <span>In genre: {currentGenre}</span>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>
                {a.author.name}, born: {a.author.born}
              </td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Genres
        genres={genresResult.data.allGenres}
        setCurrentGenre={setCurrentGenre}
      />
    </div>
  );
};

export default Books;
