import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_AUTHOR } from "./queries";
import image from "../static/images/book.jpg";
const SingleAuthorPage = () => {
  const { authorId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_AUTHOR, {
    variables: { authorId },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.getAuthorById;

  return (
    <div className="w-5/12 border-gray-400 border-2">
      <div className="flex">
        <header className="text-3xl">{author.name}</header>
      </div>
      <div className="flex">
        <div>
          <img src={image} className="max-w-60" alt="Author"></img>
        </div>
        <div>
          <p>Born: {author.born}</p>
          <p>Total amount of published books: {author.bookCount}</p>
        </div>
      </div>
      <div>
        <p>Description: {author.description}</p>
      </div>
    </div>
  );
};

export default SingleAuthorPage;
