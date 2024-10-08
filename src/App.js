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
  const anotherBook = addedBook;
  //Update the genres cache with the added book
  updateCacheWithGenres(cache, { query: ALL_GENRES }, anotherBook);
  // Update the books cache with the added book
  cache.updateQuery(query, ({ allBooks }) => {
    return { allBooks: uniqByName(allBooks.concat(addedBook)) };
  });
  console.log("Genre of the added book", addedBook.genres);
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
  cache.updateQuery(query, ({ allGenres }) => {
    return { allGenres: uniqByName(allGenres.concat(addedBook.genres[0])) };
  });
};

const App = () => {
  const client = useApolloClient();
  //Get the token from local storage to check if the user is logged in.
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );

  const padding = { padding: 5 };

  //Subscription to listen for new books and alert if adding is succesful.
  useSubscription(BOOK_ADDED, {
    onData: ({ data, error }) => {
      const addedBook = data.data.bookAdded;
      console.log(error);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
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
        <div className="flex flex-col sm:flex-row">
          <div className="sticky top-11 z-50 mx-2 flex h-52 w-full min-w-24 overflow-auto py-3 sm:top-20 sm:mt-80 sm:w-4/12 sm:min-w-32 sm:justify-end">
            <header className="sticky mr-4 flex w-full justify-center overflow-hidden rounded-md border-2  border-gray-400 bg-red-200 sm:mr-0 sm:w-1/4 sm:min-w-32 sm:justify-end">
              <div className="flex flex-col justify-center text-xl text-red-400">
                <div className="navBarLinks">
                  <NavLink
                    style={padding}
                    data-test="nav-authors"
                    to="/"
                    label="Authors"
                  ></NavLink>
                  <NavLink
                    style={padding}
                    data-test="nav-books"
                    to="/books"
                    label="Books"
                  ></NavLink>
                </div>
                <main>
                  {!token && (
                    <div className="navBarLinks">
                      <NavLink
                        style={padding}
                        data-test="nav-login"
                        to="/login"
                        label="Login"
                      ></NavLink>
                      <NavLink
                        data-test="nav-register"
                        style={padding}
                        to="/register"
                        label="Register"
                      ></NavLink>
                    </div>
                  )}
                  {token && (
                    <div
                      data-test="logged-in-nav"
                      className="text-xl text-red-400"
                    >
                      <div className="navBarLinks">
                        <NavLink
                          dataTest="nav-addbook"
                          to="/addbook"
                          label="Add book"
                        ></NavLink>
                        <NavLink
                          dataTest="nav-suggestions"
                          to="/suggestions"
                          label="Suggestions"
                        ></NavLink>
                        <NavLink
                          to="/login"
                          label="Logout"
                          dataTest="nav-logout"
                          state={{ logoutStatus: true }}
                        ></NavLink>
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </header>
          </div>
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
            ></Route>
            <Route path="/register" element={<RegisterForm />}></Route>
            <Route path="/book/:bookId" element={<SingleBookPage />}></Route>
            <Route
              path="/authors/:authorId"
              element={<SingleAuthorPage />}
            ></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
