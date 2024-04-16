import { ALL_BOOKS, ALL_GENRES } from "./queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_BOOK } from "./queries";
import Genres from "./Genres";
import { updateCacheDelete } from "../App";
const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const result = useQuery(ALL_BOOKS);

  const genresResult = useQuery(ALL_GENRES);
  //Check if user is logged in
  const token = localStorage.getItem("library-user-token");
  console.log(token);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
    },
    update: (cache, response) => {
      updateCacheDelete(
        cache,
        { query: { ALL_BOOKS } },
        response.data.deleteBook
      );
    },
  });

  const onDelete = async (bookId) => {
    console.log(bookId);
    deleteBook({
      variables: { id: bookId },
    });
  };

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
              <td>
                {token && (
                  <button onClick={() => onDelete(a.id)}>Delete</button>
                )}
              </td>
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
