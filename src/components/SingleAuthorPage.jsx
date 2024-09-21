import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_AUTHOR, ALL_BOOKS } from "./queries";
import AuthorImage from "./AuthorImage";
import BookImage from "./BookImage";
import PropTypes from "prop-types";
const SingleAuthorPage = () => {
  const { authorId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_AUTHOR, {
    variables: { authorId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.getAuthorById;

  const AuthorsBookList = ({ authorName }) => {
    const { loading, error, data } = useQuery(ALL_BOOKS, {
      variables: { author: authorName },
    });
    if (loading)
      return (
        <p data-test="author-book-list" className="m-2 p-2">
          Loading...
        </p>
      );
    if (error)
      return (
        <p data-test="author-book-list" className="m-2 p-2">
          Error: {error.message}
        </p>
      );
    if (data.allBooks.length === 0)
      return (
        <p data-test="author-book-list" className="m-2 p-2">
          No books found by this author
        </p>
      );
    return (
      <div data-test="author-book-list" className="flex flex-col ">
        {data.allBooks.map((book) => (
          <Link key={book.id} to={"/book/" + book.id}>
            <div className="m-4 grid grid-cols-2 rounded-md border-2 border-gray-400">
              <div>
                <BookImage bookId={book.id} />
              </div>
              <div className="border-2 border-l-gray-400 bg-gray-200">
                <p className="m-4 text-xl">Title: {book.title}</p>
                <p className="m-4 text-xl">Published: {book.published}</p>
                <p className="m-4 text-xl">Genres: {book.genres.join(", ")}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="my-2 w-4/12 border-2 border-gray-400">
      <div className="flex overflow-hidden border-2 border-b-gray-400 bg-red-200">
        <header className="p-2 text-4xl ">
          <h1 data-test="author-name-header">{author.name}</h1>
        </header>
      </div>
      <div className="flex border-2 border-b-gray-400">
        <div className="m-4 max-w-60 border-2 border-gray-200">
          <AuthorImage authorId={author.id} />
        </div>
        <div
          data-test="author-info-box"
          className="my-4 w-6/12 rounded-md border-2 border-black bg-gray-200"
        >
          <p className="mb-6 px-2 text-2xl">Born: {author.born}</p>
          <p className="mb-6 px-2 text-2xl">Books: {author.bookCount}</p>
          <p className="mb-6 px-2 text-2xl">Nationality: </p>
        </div>
      </div>
      <div className="border-2 border-b-gray-400">
        <p
          data-test="author-desc-header"
          className="border-b-2 border-gray-400 bg-red-200 p-4 text-3xl"
        >
          Description:
        </p>
        <div
          data-test="author-desc"
          className="m-4 min-h-40 min-w-40 rounded-md border-2 border-gray-400"
        >
          {author.description}
        </div>
      </div>
      <div>
        <p
          data-test="author-books-header"
          className="border-b-2 border-gray-400 bg-red-200 p-4 text-3xl"
        >
          Books by this author:
        </p>
        <div>
          <AuthorsBookList authorName={author.name} />
        </div>
      </div>
    </div>
  );
};

SingleAuthorPage.propTypes = {
  authorName: PropTypes.string.isRequired,
};
export default SingleAuthorPage;
