import { useState, useRef, useEffect, useCallback } from "react";
import { memo } from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import image from "../static/images/book.jpg";
import AuthorFilter from "./AuthorFilter";
import propTypes from "prop-types";
const AuthorsDialog = ({ open, setAuthorsDialogOpen, setAuthor }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorSearchInput, setAuthorSearchinput] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const dialogRef = useRef(null);
  const handleClose = useCallback(() => {
    setAuthorsDialogOpen(false);
    setSelectedAuthor(null);
    setAuthorSearchinput("");
  }, [setAuthorsDialogOpen]);

  const handleOk = useCallback(() => {
    setAuthor(selectedAuthor);
    setSelectedAuthor(selectedAuthor);
    setAuthorsDialogOpen(false);
  }, [selectedAuthor, setAuthorsDialogOpen, setAuthor]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setAuthorSearchinput(e.target.value);
  }, []);

  const handleSortCriteriaChange = useCallback((e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);
  }, []);

  const sortAuthors = useCallback((authors, sortCriteria) => {
    const authorsCopy = [...authors];
    if (sortCriteria === "name") {
      return authorsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortCriteria === "bookCount") {
      return authorsCopy.sort((a, b) => b.bookCount - a.bookCount);
    }
    if (sortCriteria === "Year of birth") {
      return authorsCopy.sort((a, b) => a.born - b.born);
    }
    return authors;
  }, []);

  const filterAuthors = useCallback(
    (authors, searchTerm) => {
      const sortedAuthors = sortAuthors(authors, sortCriteria);
      return sortedAuthors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm)
      );
    },
    [sortAuthors, sortCriteria]
  );

  useEffect(() => {
    console.log("Authors dialog open: ", open);
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  const AuthorsDialogHeader = ({ selectedAuthor }) => {
    return (
      <>
        <h1 className="text-2xl font-bold">Authors</h1>
        <header className="flex py-2 text-xl">
          Selected author:{" "}
          <p className="border-b-2 border-black px-2 font-semibold">
            {selectedAuthor}
          </p>
        </header>
      </>
    );
  };
  AuthorsDialogHeader.propTypes = {
    selectedAuthor: propTypes.string,
  };
  const AuthorsSortCriteriaDropdown = ({ criteria }) => {
    return (
      <div className=" w-1/3 border-2 border-gray-400 bg-gray-200  p-1 ">
        <label htmlFor="sortMenu" className="text-xl ">
          Sort by:{" "}
        </label>
        <select
          id="sortMenu"
          name="sortMenu"
          onChange={handleSortCriteriaChange}
          value={criteria}
          className="rounded-md border-2 border-gray-400 p-1"
        >
          <option defaultValue={true} disabled>
            Select sort criteria
          </option>
          <option value="name">Name</option>
          <option value="bookCount">Book Count</option>
          <option value="Year of birth"> Year of birth</option>
        </select>
      </div>
    );
  };
  AuthorsSortCriteriaDropdown.propTypes = {
    criteria: propTypes.string,
  };
  const AuthorsDialogGrid = memo(
    ({ data, filterAuthors, error, loading, authorSearchInput }) => {
      if (loading) return <div>Loading authors...</div>;
      if (error)
        return <div>An error has occured. Please try again later.</div>;
      const authors = data.allAuthors;
      const filteredAuthors = filterAuthors(authors, authorSearchInput);
      return (
        <>
          <section className="my-2 grid grid-cols-2 gap-4 border-2 border-gray-400 bg-gray-200 py-2">
            <header className="border-r-2 border-gray-400 px-1 text-xl">
              Author
            </header>
            <header className="px-1 text-xl">Info</header>
          </section>
          <section>
            <form className="h-96 overflow-y-scroll ">
              <section className="grid grid-cols-2 gap-4">
                {filteredAuthors.length === 0 && (
                  <div className="col-span-2 flex justify-center rounded-md border-2 border-gray-400 bg-red-300 p-4 text-xl">
                    No authors found with search term &quot;{authorSearchInput}
                    &quot;!
                  </div>
                )}
                {filteredAuthors.map((author) => (
                  <>
                    <img className="w-2/4" src={image} alt="swag"></img>
                    <div
                      className="rounded-md border-2 border-gray-400 bg-gray-200 p-1"
                      id={author.id}
                    >
                      <ul>
                        <li className="py-1">
                          Name: <b>{author.name}</b>
                        </li>
                        <li className="py-1">Born: {author.born}</li>
                        <li className="py-1">
                          Total Books: {author.bookCount}
                        </li>
                        <li className="py-1">
                          <button
                            className="registerButton"
                            onClick={() => setSelectedAuthor(author.name)}
                          >
                            Select Author
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className=" col-span-2 border-b-2 border-gray-400"></div>
                  </>
                ))}
              </section>
            </form>
          </section>

          <button
            onClick={handleOk}
            className="m-2 scale-100 rounded-md border-2 border-black bg-green-500 p-2 transition duration-300 ease-linear hover:scale-110"
            type="button"
          >
            OK
          </button>
          <button
            onClick={handleClose}
            className="m-2 scale-100 rounded-md border-2 border-black bg-red-500 p-2 transition duration-300 ease-linear hover:scale-110"
            type="button"
          >
            Cancel
          </button>
        </>
      );
    }
  );
  AuthorsDialogGrid.displayName = "AuthorsDialogGrid";
  AuthorsDialogGrid.propTypes = {
    data: propTypes.object,
    filterAuthors: propTypes.func,
    error: propTypes.object,
    loading: propTypes.bool,
    authorSearchInput: propTypes.string,
  };
  return (
    <dialog
      className={`w-full rounded-md border-2 border-gray-400 bg-red-200 p-2 backdrop-blur-sm sm:w-6/12 `}
      ref={dialogRef}
    >
      <AuthorsDialogHeader selectedAuthor={selectedAuthor} />
      <AuthorFilter setAuthorToSearch={setAuthorSearchinput} />
      <AuthorsSortCriteriaDropdown criteria={sortCriteria} />
      <AuthorsDialogGrid
        data={data}
        filterAuthors={filterAuthors}
        loading={loading}
        error={error}
        authorSearchInput={authorSearchInput}
        handleChange={handleChange}
      />
    </dialog>
  );
};
AuthorsDialog.propTypes = {
  open: propTypes.bool,
  setAuthorsDialogOpen: propTypes.func,
  setAuthor: propTypes.func,
};
export default AuthorsDialog;
