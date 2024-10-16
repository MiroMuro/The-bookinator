import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Suggestions from "./components/Suggestions.jsx";
import Header from "./components/Header.jsx";
import SingleBookPage from "./components/SingleBookPage.jsx";
import { useSubscription, useApolloClient } from "@apollo/client";
import {
  BOOK_ADDED,
  ALL_BOOKS,
  ALL_GENRES,
  ALL_AUTHORS,
  AUTHOR_ADDED,
} from "./components/queries.js";
import NavLink from "./components/NavLink.jsx";
import SingleAuthorPage from "./components/SingleAuthorPage.jsx";

const updateCache = (cache, query, addedBook) => {
  //This is used to eliminate duplicate books from saving to the cache
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  // Update the books cache with the added book
  cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    console.log("The query is: ", query);
    console.log("The data is: ", data);
    return { allBooks: uniqByName(data.allBooks.concat(addedBook)) };
  });
};

const updateAuthorCache = (cache, query, addedAuthor) => {
  // This is used to eliminate duplicate authors from saving to the cache
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allAuthors }) => {
    return { allAuthors: uniqByName(allAuthors.concat(addedAuthor)) };
  });
};

export const updateCacheWithGenres = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, (data) => {
    const existingGenres = data?.allGenres || [];

    // Ensure 'addedBook.genres' is defined and an array before concatenating
    const newGenres = addedBook.genres ? addedBook.genres[0] : [];

    // Merge and filter duplicates
    return { allGenres: uniqByName(existingGenres.concat(newGenres)) };
  });
};

const App = () => {
  const client = useApolloClient();

  //Get the token from local storage to check if the user is logged in.
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const padding = { padding: "8px" };

  //Subscription to listen for new books and alert if adding is succesful.
  useSubscription(BOOK_ADDED, {
    onData: ({ data, error }) => {
      const addedBook = data.data.bookAdded;
      console.log(error);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      updateCacheWithGenres(client.cache, { query: ALL_GENRES }, addedBook);
    },
  });

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data }) => {
      const addedAuthor = data.data.authorAdded;
      updateAuthorCache(client.cache, { query: ALL_AUTHORS }, addedAuthor);
    },
  });
  return (
    <Router>
      <div className="font-body">
        <Header token={token} />
        <div className="flex flex-col md:flex-row">
          {/* Hamburger Button */}
          <div className="my-2 flex flex-row rounded-md border-2 border-solid border-gray-400 p-4 md:hidden">
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="size-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
            <p className="ml-6 text-lg">Menu</p>
          </div>

          {/* Menu */}
          <div
            className={`sticky top-11 z-50 mx-auto flex w-10/12 min-w-24 overflow-auto py-3 md:top-20 md:m-2 md:mt-80 md:flex md:max-h-52 md:w-4/12 md:min-w-28 md:flex-row-reverse md:justify-center  ${
              menuOpen ? "block" : "hidden"
            } md:block`}
          >
            <header className="flex w-full justify-center overflow-hidden rounded-md border-2 border-gray-400 bg-red-200 md:mr-0 md:w-1/4 md:min-w-36 md:justify-end">
              <div className="flex flex-col justify-center text-xl text-red-400">
                <div className="navBarLinks">
                  <NavLink
                    style={padding}
                    data-test="nav-authors"
                    to="/"
                    label="Authors"
                  />
                  <NavLink
                    style={padding}
                    data-test="nav-books"
                    to="/books"
                    label="Books"
                  />
                </div>
                <main>
                  {!token && (
                    <div className="navBarLinks">
                      <NavLink
                        style={padding}
                        data-test="nav-login"
                        to="/login"
                        label="Login"
                      />
                      <NavLink
                        data-test="nav-register"
                        style={padding}
                        to="/register"
                        label="Register"
                      />
                    </div>
                  )}
                  {token && (
                    <div
                      data-test="logged-in-nav"
                      className="text-xl text-red-400"
                    >
                      <div className="navBarLinks">
                        <NavLink
                          data-test="nav-addbook"
                          to="/addbook"
                          label="Add book"
                        />
                        <NavLink
                          data-test="nav-suggestions"
                          to="/suggestions"
                          label="Suggestions"
                        />
                        <NavLink
                          to="/login"
                          label="Logout"
                          data-test="nav-logout"
                          state={{ logoutStatus: true }}
                        />
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </header>
          </div>

          {/* Main Content */}
          <Routes>
            <Route
              path="/"
              element={<Authors token={token} setToken={setToken} />}
            />
            <Route path="/books" element={<Books setToken={setToken} />} />
            <Route
              path="/addbook"
              element={<NewBook setToken={setToken} token={token} />}
            />
            <Route
              path="/login"
              element={<LoginForm token={token} setToken={setToken} />}
            />
            <Route
              path="/suggestions"
              element={<Suggestions setToken={setToken} />}
            />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/book/:bookId" element={<SingleBookPage />} />
            <Route path="/authors/:authorId" element={<SingleAuthorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
