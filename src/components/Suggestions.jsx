import { useQuery } from "@apollo/client";
import { GET_USER, ALL_BOOKS } from "./queries";
import image from "../static/images/book.jpg";

const Suggestions = () => {
  const userInfo = useQuery(GET_USER);

  const favoriteGenre = userInfo.loading ? "" : userInfo.data.me.favoriteGenre;

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });

  if (userInfo.loading || loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col w-7/12">
      <div className="flex bg-red-200 rounded-md border-2 my-4 p-2 border-red-400  m-auto">
        <h2>
          Book suggestions for your favourite genre:{" "}
          <strong>{favoriteGenre}</strong>
          <br />
          You can change your favorite genre in the profile section.
        </h2>
      </div>
      <div className="flex flex-wrap bg-blue-50   m-auto">
        {/* Cards go here*/}
        {data.allBooks.map((book) => (
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
export default Suggestions;
