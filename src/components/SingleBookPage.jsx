import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_BOOK, GET_BOOK_IMAGE } from "./queries";
import BookImage from "./BookImage";
const SingleBookPage = () => {
  const { bookId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_BOOK, {
    variables: { bookId },
  });

  /* const { imageLoading, imageError, imageData } = useQuery(GET_BOOK_IMAGE, {
    variables: { bookId },
  });*/

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log("THe data is", data.getBookById);
  console.log(bookId);
  const bookData = data.getBookById;
  //const image = imageData.getBookImage;
  return (
    <div className="w-4/12 my-2 border-gray-400 border-2 rounded-md overflow-hidden">
      <div className="flex bg-red-200 border-b-gray-400 border-2 ">
        <header className="p-2 text-4xl ">
          <h1>{bookData.title}</h1>
        </header>
      </div>
      <div className="flex border-b-gray-400 border-2">
        <div className="max-w-60 m-4 border-2 border-gray-200">
          <BookImage bookId={bookData.id} />
        </div>
        <div className="my-4 w-6/12 border-2 border-black rounded-md bg-gray-200">
          <p className="text-xl mb-6 px-2">Author: {bookData.author.name}</p>
          <p className="text-xl mb-6 px-2">
            Author born: {bookData.author.born}
          </p>
          <p className="text-xl mb-6 px-2">
            Book published: {bookData.published}{" "}
          </p>
          <p className="text-xl mb-6 px-2">
            Genres: {bookData.genres.join(", ")}{" "}
          </p>
        </div>
      </div>
      <div>
        <p className="text-2xl m-4">Description: </p>
        <div className="border-2 text-lg m-4 min-h-40 min-w-40 border-black">
          {" "}
          {bookData.description}
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
