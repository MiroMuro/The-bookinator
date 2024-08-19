import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_BOOK } from "./queries";
const SingleBookPage = () => {
  const { bookId } = useParams();

  const { loading, error, data } = useQuery(GET_SINGLE_BOOK, {
    variables: { bookId },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log("THe data is", data.getBookById);
  console.log(bookId);
  return <div>Single Book Page</div>;
};

export default SingleBookPage;
