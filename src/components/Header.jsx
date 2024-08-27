import React from "react"; // Import the React module
import PropTypes from "prop-types"; // Add this line to import PropTypes

import { GET_USER } from "./queries";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import image from "./open-book.png"; // Import the image file
const Header = ({ token }) => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER);
  let greeting = useRef("Not logged in yet!");

  // eslint-disable-next-line no-restricted-globals
  addEventListener("storage", (event) => {
    console.log("Storage event", event);
  });

  useEffect(() => {
    if (!token) {
      greeting.current = "Not logged in";
    } else if ((token && userLoading) || userError) {
      greeting.current = `Welcome back!`;
    } else {
      greeting.current = `Welcome back, ${userData.user.username}!`;
    }
  }, [token]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-2 border-gray-400 bg-red-200 p-3">
      <img src={image} alt="Bookinator logo"></img>{" "}
      {/* Use the 'import' statement and add '.default' to the image source */}
      <p data-test="header-greeting">Welcome to the Bookinator!</p>
      <p data-test="user-greeting">{greeting.current}</p>
    </header>
  );
};
Header.propTypes = {
  token: PropTypes.string,
};

export default Header;
