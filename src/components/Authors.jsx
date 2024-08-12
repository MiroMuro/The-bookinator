import { useQuery, useMemo } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useState } from "react";
import TimeOutDialog from "./TimeOutDialog";
const Authors = ({ token, setToken }) => {
  //Different states of the query.
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [authorToSearch, setAuthorToSearch] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("");
  const [reverseSort, setReverseSort] = useState({
    name: false,
    born: false,
    bookCount: false,
  });
  const handleClose = () => {
    setErrorDialogOpen(false);
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
    return <div>Error fetching the authors...</div>;
  };

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
      console.log("Sort by born");
      console.log("reverseSort ", reverseSort);
      return authorsCopy.sort((a, b) =>
        reverseSort.born ? b.born - a.born : a.born - b.born
      );
    }
    return authors;
  };
  const filterAuthors = (authors, authorToSearch) => {
    if (authors.length) {
      const sortedAuthors = sortAuthors(authors, sortCriteria);
      return sortedAuthors.filter((author) =>
        author.name.toLowerCase().includes(authorToSearch)
      );
    }
  };

  const AuthorsTable = ({ authors }) => {
    if (!authors) {
      return <div>No authors added yet.</div>;
    } else {
      return (
        <table className="authorsTable">
          <thead className="">
            <tr className="w-8/12">
              <th className="py-3 bg-red-400">Author</th>
              <th className="py-3 bg-red-400">Born</th>
              <th className="py-3 bg-red-400">Books</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {authors.map((author) => (
              <tr key={author.id} className="authorsTableRow">
                <td className="py-3 px-6">{author.name}</td>
                <td className="py-3 px-6">{author.born}</td>
                <td className="py-3 px-6">{author.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  const AuthorsGrid = ({ authors }) => {
    if (!authors) {
      return <div>No authors added yet.</div>;
    } else {
      return (
        <div>
          <div className="font-semibold grid grid-cols-3 shadow-2xl border-2 border-gray-400 min-w-72 w-full sm:w-5/12">
            <header
              className=" py-3 bg-red-400 text-center cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Author
            </header>
            <header
              className=" py-3 bg-red-400 text-center cursor-pointer"
              onClick={() => handleSort("born")}
            >
              Born
            </header>
            <header
              className=" py-3 bg-red-400 text-center cursor-pointer"
              onClick={() => handleSort("bookCount")}
            >
              Books
            </header>
          </div>
          <div>
            <div className="border-2 border-gray-400 bg-red-100 w-full sm:w-5/12">
              {authors.length === 0 && (
                <div className="text-center font-semibold hover:bg-red-200 cursor-pointer  shadow-2xl border-b-2 border-gray-400 min-w-72 w-full">
                  No authors found !
                </div>
              )}
              {authors.map((author) => (
                <section className=" hover:bg-red-200 cursor-pointer grid p-2 grid-cols-3 gap-3 shadow-2xl border-b-2 border-gray-400 min-w-72 w-full">
                  <div className=" text-center">{author.name}</div>
                  <div className=" text-center">{author.born}</div>
                  <div className=" text-center">{author.bookCount}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return <div>Loading authors...</div>;
  }
  if (error) {
    console.log(error);
    if (
      error.networkError &&
      error.networkError &&
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
    <div className="flex flex-col justify-start align-middle items-start-h-screen w-full sm:w-8/12">
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
      <AuthorsGrid authors={filteredAuthors} />
    </div>
  );
};

export default Authors;
