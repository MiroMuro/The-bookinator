import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_BOOK } from "./queries";
import BookImage from "./BookImage";
const SingleBookPage = () => {
  const { bookId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_BOOK, {
    variables: { bookId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const bookData = data.getBookById;
  return (
    <div className="my-2 mx-auto w-4/12 min-w-96 overflow-hidden rounded-md border-2 border-gray-400 md:mx-0">
      <div className="flex border-2 border-b-gray-400 bg-red-200 ">
        <header className="p-2 text-4xl ">
          <h1>{bookData.title}</h1>
        </header>
      </div>
      <div className="flex border-2 border-b-gray-400">
        <div className="m-4 w-4/12 border-2 border-gray-200">
          <BookImage bookId={bookData.id} />
        </div>
        <div className="m-4 w-8/12 rounded-md border-2 border-black bg-gray-200">
          <p className="mb-6 px-2 text-xl">Author: {bookData.author.name}</p>
          <p className="mb-6 px-2 text-xl">
            Author born: {bookData.author.born}
          </p>
          <p className="mb-6 px-2 text-xl">
            Book published: {bookData.published}{" "}
          </p>
          <p className="mb-6 px-2 text-xl">
            Genres: {bookData.genres.join(", ")}{" "}
          </p>
        </div>
      </div>
      <div>
        <p className="m-4 text-2xl">Description: </p>
        <div className="m-4 p-2 min-h-40 min-w-40 rounded-md border-2 border-gray-400 text-lg">
          {" "}
          {bookData.description}
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
