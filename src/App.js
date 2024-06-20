import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Suggestions from "./components/Suggestions.jsx";
import { useSubscription, useApolloClient } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS, ALL_GENRES } from "./components/queries.js";
import NavLink from "./components/NavLink.jsx";
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
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;

      window.alert(`A new book was added. \nTitle: ${addedBook.title}\nAuthor: ${addedBook.author.name}
      Published: ${addedBook.published}\nGenres : ${addedBook.genres}`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  return (
    <Router>
      <div className="flex  font-body">
        <div className="w-4/12 mt-80 py-3 h-1/4 overflow-auto sticky top-0">
          <header>
            <div className="text-red-400 text-xl  ">
              <div className="navBarLinks">
                <NavLink style={padding} to="/" label="Authors"></NavLink>
                <NavLink style={padding} to="/books" label="Books"></NavLink>
              </div>
              <main>
                {!token && (
                  <div className="navBarLinks">
                    <NavLink
                      style={padding}
                      to="/login"
                      label="Login"
                    ></NavLink>
                    <NavLink
                      style={padding}
                      to="/register"
                      label="Register"
                    ></NavLink>
                  </div>
                )}
                {token && (
                  <div className="text-red-400 text-xl">
                    <div className="navBarLinks">
                      <NavLink
                        style={padding}
                        to="/add"
                        label="Add book"
                      ></NavLink>
                      <NavLink
                        style={padding}
                        to="/suggestions"
                        label="Suggestions"
                      ></NavLink>
                      <NavLink
                        style={padding}
                        to="/login"
                        state={{ logoutStatus: true }}
                        label="Logout"
                      ></NavLink>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </header>
        </div>
        <Routes>
          <Route path="/" element={<Authors token={token} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route
            path="/login"
            element={<LoginForm token={token} setToken={setToken} />}
          />
          <Route path="/suggestions" element={<Suggestions />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
