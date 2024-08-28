import React from "react"; // Import the React module
import PropTypes from "prop-types"; // Add this line to import PropTypes

import { GET_USER } from "./queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import image from "./open-book.png"; // Import the image file
const Header = ({ token }) => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER, {
    skip: !token,
    fetchPolicy: "network-only",
  });

  const [greeting, setGreeting] = useState(
    "Welcome! You are not logged in yet!"
  );
  // eslint-disable-next-line no-restricted-globals
  addEventListener("storage", (event) => {
    console.log("Storage event", event);
  });

  useEffect(() => {
    if (!token) {
      setGreeting("Welcome! You are not logged in yet!");
    } else if (userLoading) {
      setGreeting("Loading...");
    } else if (userError) {
      setGreeting(
        "An error occurred while fetching user data. Please try again later."
      );
    } else if (userData && userData.me) {
      setGreeting(`Welcome ${userData.me.username}!`);
    }
  }, [token, userData, userLoading, userError]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-2 border-gray-400 bg-red-200 p-3">
      <img src={image} alt="Bookinator logo"></img>{" "}
      <p data-test="header-greeting">Welcome to the Bookinator!</p>
      <p data-test="user-greeting">{greeting}</p>
    </header>
  );
};
Header.propTypes = {
  token: PropTypes.string,
};

export default Header;
