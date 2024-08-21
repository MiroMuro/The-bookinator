import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_AUTHOR, ALL_BOOKS } from "./queries";
import image from "../static/images/book.jpg";
import BookImage from "./BookImage";
const SingleAuthorPage = () => {
  const { authorId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_AUTHOR, {
    variables: { authorId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.getAuthorById;

  const AuthorsBookList = ({ authorName }) => {
    console.log("The author name is", authorName);
    const { loading, error, data } = useQuery(ALL_BOOKS, {
      variables: { author: authorName },
    });
    console.log("The data is", data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
      <div className="flex flex-col ">
        {data.allBooks.map((book) => (
          <Link to={"/book/" + book.id}>
            <div className="grid grid-cols-2 border-2 border-gray-400 rounded-md m-4">
              <div>
                <BookImage bookId={book.id} />
              </div>
              <div className="bg-gray-200 border-2 border-l-gray-400">
                <p className="text-xl m-4">Title: {book.title}</p>
                <p className="text-xl m-4">Published: {book.published}</p>
                <p className="text-xl m-4">Genres: {book.genres.join(", ")}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  console.log(author);
  return (
    <div className="w-4/12 my-2 border-gray-400 border-2">
      <div className="flex bg-red-200 border-b-gray-400 border-2 overflow-hidden">
        <header className="p-2 text-4xl ">
          <h1>{author.name}</h1>
        </header>
      </div>
      <div className="flex border-b-gray-400 border-2">
        <div>
          <img
            src={image}
            className="max-w-60 m-4 border-2 border-black"
            alt="Author"
          ></img>
        </div>
        <div className="my-4 border-2 border-black rounded-md bg-gray-200 w-6/12">
          <p className="text-2xl mb-6 px-2">Born: {author.born}</p>
          <p className="text-2xl mb-6 px-2">Books: {author.bookCount}</p>
          <p className="text-2xl mb-6 px-2">Nationality: </p>
        </div>
      </div>
      <div className="border-b-gray-400 border-2">
        <p className="text-3xl p-4 border-b-2 border-gray-400 bg-red-200">
          Description:{" "}
        </p>
        <div className="border-2 m-4 min-h-40 min-w-40 border-black">
          {" "}
          {author.description}
        </div>
      </div>
      <div>
        <p className="text-3xl p-4 bg-red-200 border-b-2 border-gray-400">
          Books by this author:
        </p>
        <div>
          <AuthorsBookList authorName={author.name} />
        </div>
      </div>
    </div>
  );
};

export default SingleAuthorPage;
