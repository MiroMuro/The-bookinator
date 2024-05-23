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
  //This is used to eliminate duplicate books from from saving to the cache
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
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );

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
      <div className="flex  font-body">
        <div className="w-4/12 mt-80  h-1/4 overflow-auto sticky top-0">
          <header>
            <div className="text-red-400 text-xl  ">
              <div className="navBarLinks">
                <Link style={padding} to="/">
                  <h2 className="linksOnHover">Authors</h2>
                </Link>
                <Link style={padding} to="/books">
                  <h2 className="linksOnHover">Books</h2>
                </Link>
              </div>
              <main>
                {!token && (
                  <div className="navBarLinks">
                    <Link style={padding} to="/login">
                      <h2 className="linksOnHover">Login</h2>
                    </Link>
                    <Link style={padding} to="/register">
                      <h2 className="linksOnHover">Register</h2>
                    </Link>
                  </div>
                )}
                {token && (
                  <div className="text-red-400 text-xl">
                    <div className="navBarLinks">
                      <Link style={padding} to="/add">
                        <h2 className="linksOnHover">Add book</h2>
                      </Link>
                      <Link style={padding} to="/recommendations ">
                        <h2 className="linksOnHover">Suggestions</h2>
                      </Link>
                      <Link
                        style={padding}
                        to="/login"
                        state={{ logoutStatus: true }}
                      >
                        <h2 className="linksOnHover">Logout</h2>
                      </Link>
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
          <Route path="/recommendations" element={<Recommendations />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
