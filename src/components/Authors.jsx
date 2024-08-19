import { useQuery, useMemo } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useState } from "react";
import TimeOutDialog from "./TimeOutDialog";
import { Link } from "react-router-dom";
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
  const [authorsPerPage, setAuthorsPerPage] = useState(10);
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
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
      <div className="border-2 border-gray-400 rounded-md p-2 bg-red-500 m-2 h-1/6">
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

  const AuthorsGrid = ({ filteredAuthors, allAuthors }) => {
    //Slice the filtered authors based on the current page.
    //The paginate function is used to change the current page.
    const currentAuthorsOnPage = filteredAuthors.slice(
      indexOfFirstAuthor,
      indexOfLastAuthor
    );
    if (!authors) {
      return <div>No authors added yet.</div>;
    } else {
      return (
        <div>
          <div className="font-semibold grid grid-cols-3 shadow-2xl border-2 border-gray-400 min-w-72 w-full sm:w-5/12">
            <header
              className=" flex justify-center py-3 bg-red-400 text-center cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Author
              <SortingArrow isArrowUp={reverseSort.name} />
            </header>
            <header
              className=" flex justify-center py-3 bg-red-400 text-center cursor-pointer"
              onClick={() => handleSort("born")}
            >
              Born
              <SortingArrow isArrowUp={reverseSort.born} />
            </header>
            <header
              className=" flex justify-center py-3 bg-red-400 text-center cursor-pointer"
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
            <div className="border-2 border-gray-400 bg-red-100 w-full sm:w-5/12">
              {authors.length === 0 && (
                <div className="text-center font-semibold hover:bg-red-200 cursor-pointer  shadow-2xl border-b-2 border-gray-400 min-w-72 w-full">
                  No authors found !
                </div>
              )}
              {currentAuthorsOnPage.map((author) => (
                <Link to={"/authors/" + author.id}>
                  <section className="  cursor-pointer grid p-2 grid-cols-3 gap-3 shadow-2xl border-b-2 border-gray-400 min-w-72 w-full transition ease-linear duration-300 hover:bg-red-200 ">
                    <div className=" text-center">{author.name}</div>
                    <div className=" text-center">{author.born}</div>
                    <div className=" text-center">{author.bookCount}</div>
                  </section>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }
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
      <nav>
        <ul className="flex">
          {pageNumbers.map((number) => (
            <button
              className={`px-3 py-1 border rounded ${
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

  if (loading) {
    return (
      <div className="border-2 border-gray-400 rounded-md p-2 bg-yellow-200 m-2 h-1/6">
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
    <div className="flex flex-col justify-start align-middle items-start-h-screen w-4/12 mx-auto sm:w-6/12">
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

export default Authors;
