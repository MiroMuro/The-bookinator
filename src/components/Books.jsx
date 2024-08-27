import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import GenresDropdown from "./GenresDropdown";
import BookImage from "./BookImage";
import TimeOutDialog from "./TimeOutDialog";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(8);
  let indexOfLastBook = currentPage * booksPerPage;
  let indexOfFirstBook = indexOfLastBook - booksPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(e.target.value);
    paginate(1);
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
      <div className="m-2 h-1/6 rounded-md border-2 border-gray-400 bg-yellow-200 p-2">
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
      <div className="m-2 h-1/6 rounded-md border-2 border-gray-400 bg-red-500 p-2">
        A netowrk error has occured. Please try again later.
      </div>
    );

  const BookSorting = ({ sortCriteria, handleSort }) => (
    <div
      data-test="books-sorting-div"
      className="mx-2 mt-2 flex w-1/3 rounded-md border-2 border-gray-400  bg-red-200 p-2"
    >
      <div>
        <label htmlFor="sortMenu" className="text-xl ">
          Sort by:{" "}
        </label>
        <select
          data-test="sort-menu"
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
      </div>
      <div className="group relative  flex size-10 items-center">
        <button
          data-test="sort-button"
          className="mx-2 rounded-md border-2 border-gray-400 bg-white px-1 text-xl hover:scale-105 hover:cursor-pointer"
          value={sortCriteria}
          onClick={(e) => handleSort(e)}
        >
          {" "}
          ⬆⬇
        </button>
        <div className="invisible absolute left-1/2 top-full z-10 mb-2 -translate-x-1/2 rounded border-2 border-black bg-red-200 px-2 py-1 text-sm opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          Reverse the sorting order
        </div>
      </div>
    </div>
  );
  BookSorting.propTypes = {
    sortCriteria: PropTypes.string,
    handleSort: PropTypes.func,
  };

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
      <div
        data-test="books-searchbar-div"
        className="mt-2 w-1/3 rounded-md border-2 border-gray-400 bg-red-200 p-2"
      >
        <label htmlFor="searchBar" className="text-xl">
          Search title:{" "}
        </label>
        <input
          data-test="search-bar"
          className="border-2 border-gray-200 border-b-black"
          ref={inputRef}
          id="searchBar"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        ></input>
      </div>
    );
  };

  BookSearchBar.propTypes = {
    searchWord: PropTypes.string,
    setSearchWord: PropTypes.func,
  };

  const BookGrid = ({ filteredBooks }) => {
    if (filteredBooks.length === 0) {
      return <div data-test="no-books-div">No books added yet.</div>;
    } else {
      const currentBooksOnPage = filteredBooks.slice(
        indexOfFirstBook,
        indexOfLastBook
      );
      return (
        <div
          data-test="book-grid"
          className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {/* Cards go here*/}
          {currentBooksOnPage.map((book) => (
            <Link key={book.id} to={"/book/" + book.id}>
              <div
                key={book.id}
                className="scale-100 overflow-hidden rounded-lg bg-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:cursor-pointer hover:shadow-lg"
              >
                <header className=" min-h-16 bg-red-200  p-2">
                  <h2 className="mb-2 break-normal text-lg font-semibold sm:text-sm md:text-base lg:text-sm">
                    {book.title}
                  </h2>
                </header>
                <div>
                  <BookImage bookId={book.id} />
                </div>
                <div className="p-4">
                  <p className="mb-1 text-sm text-gray-600">
                    <strong>Author:</strong> {book.author.name}
                  </p>
                  <p className="mb-1 text-sm text-gray-600">
                    <strong>Born:</strong> {book.author.born}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Published:</strong> {book.published}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  BookGrid.propTypes = {
    filteredBooks: PropTypes.array,
  };

  const books = data.allBooks;
  const filteredBooks = filterBooks(books, currentGenre, searchWord);

  const Pagination = ({
    booksPerPage,
    totalFilteredBooks,
    paginate,
    currentPage,
    handleBooksPerPageChange,
  }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalFilteredBooks / booksPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav data-test="books-pagination-nav" className="flex">
        <ul className="flex">
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`rounded border px-3 py-1 ${
                currentPage === number ? "bg-red-400 text-white" : "bg-white"
              }`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
        </ul>
        <div
          data-test="pagination-dropdown"
          className="flex w-full justify-end"
        >
          <p className="text-xl">Books per page: </p>
          <select
            data-test="books-per-page-select"
            onChange={(e) => handleBooksPerPageChange(e)}
            value={booksPerPage}
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="24">24</option>
            <option value="32">32</option>
          </select>
        </div>
      </nav>
    );
  };
  Pagination.propTypes = {
    booksPerPage: PropTypes.number,
    totalFilteredBooks: PropTypes.number,
    paginate: PropTypes.func,
    currentPage: PropTypes.number,
    handleBooksPerPageChange: PropTypes.func,
  };
  return (
    <div className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
      <div className="top-60 mt-4 flex  w-full bg-white align-top ">
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
      <div>
        <Pagination
          booksPerPage={booksPerPage}
          totalFilteredBooks={filteredBooks.length}
          paginate={paginate}
          currentPage={currentPage}
          setBooksPerPage={setBooksPerPage}
          handleBooksPerPageChange={handleBooksPerPageChange}
        />
      </div>
      <div className="">
        <BookGrid filteredBooks={filteredBooks} />
      </div>
    </div>
  );
};
Books.propTypes = {
  setToken: PropTypes.func.isRequired,
  filteredBooks: PropTypes.array,
};
export default Books;
