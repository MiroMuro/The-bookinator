import React from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOK_IMAGE } from "./queries";

const BookImage = ({ bookId }) => {
  const { loading, error, data } = useQuery(GET_BOOK_IMAGE, {
    variables: { bookId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching image: {error.message}</p>;

  const imageUrl = data.getBookImage;

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Book cover" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default BookImage;
