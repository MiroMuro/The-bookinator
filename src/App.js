import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Recommendations from "./components/Recommendations";
import { useSubscription, useApolloClient } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./components/queries.js";

export const updateCache = (cache, query, addedBook) => {
  //This is used to eliminate duplicates from saving
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return { allBooks: uniqByName(allBooks.concat(addedBook)) };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const padding = { padding: 5 };
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      window.alert(`A new book was added. \nTitle: ${addedBook.title}\nAuthor: ${addedBook.author.name}
      Published: ${addedBook.published}\nGenres : ${addedBook.genres}`);
    },
  });
  return (
    <Router>
      <div>
        <div></div>
        <div>
          {!token && (
            <div>
              <Link style={padding} to="/">
                authors
              </Link>
              <Link style={padding} to="/books">
                books
              </Link>
              <Link style={padding} to="/login">
                Login
              </Link>
              <Link style={padding} to="/register">
                Register
              </Link>
            </div>
          )}
          {token && (
            <div>
              <Link style={padding} to="/">
                authors
              </Link>
              <Link style={padding} to="/books">
                books
              </Link>
              <Link style={padding} to="/add">
                add book
              </Link>
              <Link style={padding} to="/recommendations ">
                recommendations
              </Link>
              <Link style={padding} to="/login" state={{ logoutStatus: true }}>
                Logout
              </Link>
            </div>
          )}
        </div>
        <Routes>
          <Route path="/" element={<Authors token={token} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route
            path="/login"
            element={<LoginForm token={token} setToken={setToken} />}
          />
          <Route path="/recommendations" element={<Recommendations />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
