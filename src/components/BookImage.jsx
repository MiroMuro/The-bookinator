import React from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOK_IMAGE } from "./queries";

/**
 * Renders the image of a book based on the provided bookId.
 *
 * @param {Object} props - The component props.
 * @param {string} props.bookId - The ID of the book.
 * @returns {JSX.Element} The BookImage component.
 */
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
        // Display the book image if available. The image tag can translate Base64 strings to images.
        <img src={imageUrl} alt="Book cover" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default BookImage;
