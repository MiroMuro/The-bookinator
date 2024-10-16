import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useState } from "react";
import TimeOutDialog from "./TimeOutDialog";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Authors = ({ token, setToken }) => {
  //Different states of the query.
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [authorToSearch, setAuthorToSearch] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("");
  //State to reverse the sorting order.
  const [reverseSort, setReverseSort] = useState({
    name: false,
    born: false,
    bookCount: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 10;
  //2 * 10 = 20
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;

  const handleClose = () => {
    setErrorDialogOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const SortingArrow = ({ isArrowUp }) => {
    if (!isArrowUp) {
      return (
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6V18M12 18L7 13M12 18L17 13"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6V18M12 6L7 11M12 6L17 11"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  SortingArrow.propTypes = {
    isArrowUp: PropTypes.bool,
  };

  const handleTokenError = (error) => {
    return (
      <TimeOutDialog
        open={errorDialogOpen}
        onClose={handleClose}
        errorMessage={error.networkError.result.messageForUser}
        setToken={setToken}
      />
    );
  };
  const handleGeneralError = () => {
    return (
      <div className="m-2 h-1/6 rounded-md border-2 border-gray-400 bg-red-500 p-2">
        Error fetching the authors...
      </div>
    );
  };

  //When the user clicks the sorting arrow.
  const handleSort = (sortCriteria) => {
    setSortCriteria(sortCriteria);
    if (sortCriteria === "name") {
      setReverseSort((prev) => ({ ...prev, name: !prev.name }));
    }
    if (sortCriteria === "born") {
      setReverseSort((prev) => ({ ...prev, born: !prev.born }));
    }
    if (sortCriteria === "bookCount") {
      setReverseSort((prev) => ({ ...prev, bookCount: !prev.bookCount }));
    }
  };

  //Logic to sort the authors based on the sort criteria.
  const sortAuthors = (authors, sortCriteria) => {
    const authorsCopy = [...authors];
    if (sortCriteria === "name") {
      return authorsCopy.sort((a, b) =>
        reverseSort.name
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
    }
    if (sortCriteria === "bookCount") {
      return authorsCopy.sort((a, b) =>
        reverseSort.bookCount
          ? b.bookCount - a.bookCount
          : a.bookCount - b.bookCount
      );
    }
    if (sortCriteria === "born") {
      return authorsCopy.sort((a, b) =>
        reverseSort.born ? b.born - a.born : a.born - b.born
      );
    }
    return authors;
  };

  const filterAuthors = (authors, authorToSearch) => {
    if (authors.length) {
      //First sort the authors based on the sort criteria.
      const sortedAuthors = sortAuthors(authors, sortCriteria);

      //Then filter the authors based on the search criteria on the sorted list.
      return sortedAuthors.filter((author) =>
        author.name.toLowerCase().includes(authorToSearch)
      );
    }
  };

  const AuthorsGrid = ({ filteredAuthors }) => {
    //Slice the filtered authors based on the current page.
    //The paginate function is used to change the current page.

    if (!filteredAuthors) {
      return <div data-test="no-authors-div">No authors added yet.</div>;
    } else {
      const currentAuthorsOnPage = filteredAuthors.slice(
        indexOfFirstAuthor,
        indexOfLastAuthor
      );
      return (
        <div data-test="authors-grid">
          <div className="grid w-full min-w-72 grid-cols-3 border-2 border-gray-400 font-semibold shadow-2xl sm:w-5/12">
            <header
              data-test="author-name-header"
              className=" flex cursor-pointer justify-center bg-red-400 py-3 text-center"
              onClick={() => handleSort("name")}
            >
              Author
              <SortingArrow isArrowUp={reverseSort.name} />
            </header>
            <header
              data-test="author-born-header"
              className=" flex cursor-pointer justify-center bg-red-400 py-3 text-center"
              onClick={() => handleSort("born")}
            >
              Born
              <SortingArrow isArrowUp={reverseSort.born} />
            </header>
            <header
              data-test="author-books-header"
              className=" flex cursor-pointer justify-center bg-red-400 py-3 text-center"
              onClick={() => handleSort("bookCount")}
            >
              Books
              <SortingArrow isArrowUp={reverseSort.bookCount} />
            </header>
          </div>
          <div>
            <Pagination
              authorsPerPage={authorsPerPage}
              totalFilteredAuthors={filteredAuthors.length}
              paginate={paginate}
              currentPage={currentPage}
            />
            <div
              data-test="authors-mapped"
              className=" w-full min-w-72 border-2 border-gray-400 bg-red-100 sm:w-5/12"
            >
              {authors.length === 0 && (
                <div className="w-full min-w-72 cursor-pointer border-b-2  border-gray-400 text-center font-semibold shadow-2xl hover:bg-red-200">
                  No authors found !
                </div>
              )}
              {currentAuthorsOnPage.map((author, index) => (
                <Link
                  data-test={"author" + index + "-page"}
                  key={author.id}
                  to={"/authors/" + author.id}
                >
                  <section
                    data-test={"author" + index + "-section"}
                    className="grid w-full min-w-72 cursor-pointer grid-cols-3 gap-3 border-b-2 border-gray-400 p-2 shadow-2xl transition duration-300 ease-linear hover:bg-red-200 "
                  >
                    <div data-test="author-name" className=" text-center">
                      {author.name}
                    </div>
                    <div data-test="author-born" className=" text-center">
                      {author.born}
                    </div>
                    <div data-test="author-books" className=" text-center">
                      {author.bookCount}
                    </div>
                  </section>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  AuthorsGrid.propTypes = {
    filteredAuthors: PropTypes.array,
  };

  const Pagination = ({
    authorsPerPage,
    totalFilteredAuthors,
    paginate,
    currentPage,
  }) => {
    const pageNumbers = [];

    //The pagination logic depends on the list of authors that match the filter criteria.
    //This way it displays the correct number of pages.
    for (
      let i = 1;
      i <= Math.ceil(totalFilteredAuthors / authorsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <nav className="sm:w-5/12">
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
      </nav>
    );
  };

  Pagination.propTypes = {
    authorsPerPage: PropTypes.number,
    totalFilteredAuthors: PropTypes.number,
    paginate: PropTypes.func,
    currentPage: PropTypes.number,
  };

  if (loading) {
    return (
      <div className="m-2 h-1/6 rounded-md border-2 border-gray-400 bg-yellow-200 p-2">
        Loading authors...
      </div>
    );
  }
  if (error) {
    if (
      error.networkError &&
      error.networkError.result &&
      (error.networkError.result.name === "TokenExpiredError" ||
        error.networkError.result.name === "JsonWebTokenError")
    ) {
      return handleTokenError(error);
    }
    return handleGeneralError();
  }

  const authors = data.allAuthors;
  const filteredAuthors = filterAuthors(authors, authorToSearch);

  return (
    <div className=" mx-auto flex w-6/12 flex-col justify-start align-middle md:mx-auto md:w-8/12">
      {token && (
        <div className="w-full sm:w-5/12 ">
          <BirthyearForm authors={authors} />
        </div>
      )}
      <div>
        <AuthorFilter
          authorToSearch={authorToSearch}
          setAuthorToSearch={setAuthorToSearch}
        />
      </div>
      <AuthorsGrid filteredAuthors={filteredAuthors} allAuthors={authors} />
    </div>
  );
};

Authors.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};

export default Authors;
