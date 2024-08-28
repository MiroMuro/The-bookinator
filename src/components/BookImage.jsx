import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { GET_BOOK_IMAGE } from "./queries";
//Default image for books.
import image from "../static/images/book.jpg";

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
    <div className="m-2 flex items-center justify-center">
      {imageUrl ? (
        // Display the book image if available. The image tag can translate Base64 strings to images.
        <img className="max-h-36 max-w-60" src={imageUrl} alt="" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};
BookImage.propTypes = {
  bookId: PropTypes.string.isRequired,
};
export default BookImage;
