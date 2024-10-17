import React from "react";
import { useQuery } from "@apollo/client";
import { GET_AUTHOR_IMAGE } from "./queries";
//Default image for books.
import image from "../static/images/book.jpg";
import propTypes from "prop-types";
/**
 * Renders the image of a book based on the provided bookId.
 *
 * @param {Object} props - The component props.
 * @param {string} props.bookId - The ID of the book.
 * @returns {JSX.Element} The BookImage component.
 */
const AuthorImage = ({ authorId }) => {
  let imageUrl;

  const { loading, error, data } = useQuery(GET_AUTHOR_IMAGE, {
    variables: { authorId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    imageUrl = image;
  } else {
    imageUrl = data.getAuthorImage;
  }

  return (
    <div className="min-w-40 h-36 m-2 flex items-center justify-center border-2 rounded-md border-solid border-gray-400 bg-white">
      {imageUrl ? (
        // Display the book image if available. The image tag can translate Base64 strings to images.
        <img
          className="w-full h-full object-contain p-2"
          src={imageUrl}
          alt=""
        />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};
AuthorImage.propTypes = {
  authorId: propTypes.string.isRequired,
};

export default AuthorImage;
