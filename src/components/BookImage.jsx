import React from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOK_IMAGE } from "./queries";
//Default image for books.
import image from "../static/images/book.jpg";

/**
 * Renders the image of a book based on the provided bookId.
 *
 * @param {Object} props - The component props.
 * @param {string} props.bookId - The ID of the book.
 * @returns {JSX.Element} The BookImage component.
 */
const BookImage = ({ bookId }) => {
  let imageUrl;

  const { loading, error, data } = useQuery(GET_BOOK_IMAGE, {
    variables: { bookId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    imageUrl = image;
  } else {
    imageUrl = data.getBookImage;
  }

  return (
    <div className="flex justify-center items-center m-2">
      {imageUrl ? (
        // Display the book image if available. The image tag can translate Base64 strings to images.
        <img className="max-h-36 max-w-60" src={imageUrl} alt="" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default BookImage;
