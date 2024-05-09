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
  return (
    <div className="bg-blue-50">
      <h2 className="text-4xl font-bold underline uppercase p-4  font-Teachers">
        Books
      </h2>
      <span>In genre: {currentGenre}</span>
      <div className="p-6">
        <table className="table-auto rounded-lg border-solid border-black border-2">
          <tbody className="">
            <tr className="text-xl px-30 border-b-2 border-black bg-gray-200 ">
              <th>title</th>
              <th>author</th>
              <th>born</th>
              <th>published</th>
            </tr>
            {data.allBooks.map((a) => (
              <tr key={a.title} className="border-b-2">
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>born: {a.author.born}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Genres
        genres={genresResult.data.allGenres}
        setCurrentGenre={setCurrentGenre}
      />
    </div>
  );
};

export default Books;
