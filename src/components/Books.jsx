import { ALL_BOOKS, BOOK_ADDED, ALL_AUTHORS } from "./queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import GenresDropdown from "./GenresDropdown";
import image from "../static/images/book.jpg";
import TimeOutDialog from "./TimeOutDialog";
//import BooksSorting from "./BooksSorting";
const Books = ({ setToken }) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);
  const handleClose = () => setErrorDialogOpen(false);
  const { loading, error, data, subscribeToMore } = useQuery(ALL_BOOKS);
  //State to reverse the sorting order.
  const [reverseSort, setReverseSort] = useState({
    title: false,
    author: false,
    published: false,
  });
  const [sortCriteria, setSortCriteria] = useState("");
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: BOOK_ADDED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const prevGenres = subscriptionData.data.allBooks
          .map((book) => book.genres)
          .flat();
        const addedBookGenre = subscriptionData.data.bookAdded.genres;
        return {
          allGenres: prevGenres.concat(addedBookGenre),
        };
      },
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  const searchBooks = (books, searchWord) => {
    if (searchWord === "") {
      return books;
    }
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchWord.toLowerCase())
    );
  };

  const filterBooks = (books, currentGenre, searchWord) => {
    let soughtBooks = searchBooks(books, searchWord);
    let sortedBooks = sortBooks(soughtBooks, sortCriteria);
    if (currentGenre === "") {
      return sortedBooks;
    } else {
      return sortedBooks.filter((book) => book.genres.includes(currentGenre));
    }
  };

  const handleSort = (e) => {
    let sortCriteria = e.target.value;
    console.log("Sort criteria is: ", sortCriteria);
    setSortCriteria(sortCriteria);
    console.log("Reverse sort is: ", reverseSort);
    if (sortCriteria === "title") {
      setReverseSort((prev) => ({ ...prev, title: !prev.title }));
    }
    if (sortCriteria === "author") {
      setReverseSort((prev) => ({ ...prev, author: !prev.author }));
    }
    if (sortCriteria === "published") {
      setReverseSort((prev) => ({ ...prev, published: !prev.published }));
    } else {
      return;
    }
  };

  const sortBooks = (books, sortCriteria) => {
    const booksCopy = [...books];
    if (sortCriteria === "title") {
      return booksCopy.sort((a, b) =>
        reverseSort.title
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      );
    }
    if (sortCriteria === "author") {
      return booksCopy.sort((a, b) =>
        reverseSort.author
          ? b.author.name.localeCompare(a.author.name)
          : a.author.name.localeCompare(b.author.name)
      );
    }
    if (sortCriteria === "published") {
      return booksCopy.sort((a, b) =>
        reverseSort.published
          ? b.published - a.published
          : a.published - b.published
      );
    } else {
      return books;
    }
  };

  if (loading)
    return (
      <div className="border-2 border-gray-400 rounded-md p-2 bg-yellow-200 m-2 h-1/6">
        Loading books...
      </div>
    );
  if (
    error &&
    (error.networkError?.result?.name === "TokenExpiredError" ||
      error.networkError?.result?.name === "JsonWebTokenError")
  ) {
    return (
      <TimeOutDialog
        open={errorDialogOpen}
        onClose={handleClose}
        errorMessage={error.networkError.result.messageForUser}
        setToken={setToken}
      />
    );
  }
  if (error)
    return (
      <div className="border-2 border-gray-400 rounded-md p-2 bg-red-500 m-2 h-1/6">
        A netowrk error has occured. Please try again later.
      </div>
    );

  const BookSorting = ({ sortCriteria, handleSort }) => (
    <div className="w-1/3 mx-2 bg-red-200 rounded-md border-2 mt-2  p-2 border-gray-400">
      <label htmlFor="sortMenu" className="text-xl ">
        Sort by:{" "}
      </label>
      <select
        onChange={(e) => handleSort(e)}
        id="sortMenu"
        value={sortCriteria}
      >
        <option defaultValue={true} disabled>
          Select sort criteria
        </option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="published">Published</option>
      </select>
      <button
        className="text-xl mx-2"
        value={sortCriteria}
        onClick={(e) => handleSort(e)}
      >
        {" "}
        ⬆⬇
      </button>
    </div>
  );
  const BookSearchBar = ({ searchWord, setSearchWord }) => {
    const inputRef = useRef(null);
    //If a an input element is created in a nested component, react will lose focus after
    //every keystroke. This effect will keep the focus on the input element.
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchWord]);

    return (
      <div className="w-1/3 mx-2 bg-red-200 rounded-md border-2 mt-2 p-2 border-gray-400">
        <label htmlFor="searchBar" className="text-xl">
          Search title:{" "}
        </label>
        <input
          ref={inputRef}
          id="searchBar"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        ></input>
      </div>
    );
  };
  const BookGrid = ({ books }) => {
    if (books.length === 0) {
      return <div>No books added yet.</div>;
    } else {
      return (
        <div className="grid mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Cards go here*/}
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <header className=" bg-red-200 p-2  min-h-16">
                <h2 className="font-semibold break-normal text-lg mb-2 sm:text-sm md:text-base lg:text-sm">
                  {book.title}
                </h2>
              </header>
              <img
                className="w-full h-46 object-cover"
                src={image}
                alt="book"
              />
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Author:</strong> {book.author.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Born:</strong> {book.author.born}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Published:</strong> {book.published}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  const books = data.allBooks;
  const filteredBooks = filterBooks(books, currentGenre, searchWord);

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex w-full align-top  bg-white top-60 mt-4 sticky  sm:top-14">
        <div className="flex w-full ">
          <GenresDropdown
            setCurrentGenre={setCurrentGenre}
            currentGenre={currentGenre}
          />
          <BookSorting sortCriteria={sortCriteria} handleSort={handleSort} />
          <BookSearchBar
            searchWord={searchWord}
            setSearchWord={setSearchWord}
          />
        </div>
      </div>
      <div className="">
        <BookGrid books={filteredBooks} />
      </div>
    </div>
  );
};

export default Books;
