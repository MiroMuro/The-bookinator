import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import image from "../static/images/book.jpg";
import AuthorFilter from "./AuthorFilter";

const AuthorsDialog = ({
  authorToSearch,
  setAuthorToSearch,
  token,
  open,
  setAuthorsDialogOpen,
  setAuthor,
}) => {
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
    console.log("Haloo");
    setAuthor(selectedAuthor);
    setSelectedAuthor(selectedAuthor);
    //setAuthorSearchinput(selectedAuthor);
    setAuthorsDialogOpen(false);
  }, [selectedAuthor, setAuthorsDialogOpen, setAuthor]);

  const handleChange = useCallback((e) => {
    console.log("MIRO HERE", e.target.value);
    e.preventDefault();
    setAuthorSearchinput(e.target.value);
  }, []);

  const handleSortCriteriaChange = useCallback((e) => {
    const criteria = e.target.value;
    console.log("The criteria is: ", criteria);
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
        <h1 className="font-bold text-2xl">Authors</h1>
        <header className="flex py-2 text-xl">
          Selected author:{" "}
          <p className="border-b-2 px-2 font-semibold border-black">
            {selectedAuthor}
          </p>
        </header>
      </>
    );
  };
  const AuthorsSortCriteriaDropdown = ({ criteria }) => {
    return (
      <div className=" p-1 bg-gray-200 border-2 border-gray-400  w-1/3 ">
        <label htmlFor="sortMenu" className="text-xl ">
          Sort by:{" "}
        </label>
        <select
          id="sortMenu"
          name="sortMenu"
          onChange={handleSortCriteriaChange}
          value={criteria}
          className="border-2 border-gray-400 rounded-md p-1"
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
  const AuthorsDialogGrid = React.memo(
    ({ data, filterAuthors, error, loading, authorSearchInput }) => {
      if (loading) return <div>Loading authors...</div>;
      if (error)
        return <div>An error has occured. Please try again later.</div>;
      const authors = data.allAuthors;
      const filteredAuthors = filterAuthors(authors, authorSearchInput);
      return (
        <>
          <section className="grid grid-cols-2 gap-4 py-2 my-2 border-2 border-gray-400 bg-gray-200">
            <header className="text-xl px-1 border-r-2 border-gray-400 overflow">
              Author
            </header>
            <header className="text-xl px-1">Info</header>
          </section>
          <section>
            <form className="h-96 overflow-y-scroll ">
              <section className="grid grid-cols-2 gap-4">
                {filteredAuthors.length === 0 && (
                  <div className="col-span-2 text-xl flex bg-red-300 border-2 border-gray-400 rounded-md p-4 justify-center">
                    No authors found with search term "{authorSearchInput}"!
                  </div>
                )}
                {filteredAuthors.map((author) => (
                  <>
                    <img className="w-2/4" src={image} alt="swag"></img>
                    <div
                      className="bg-gray-200 p-1 border-2 border-gray-400 rounded-md"
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
            className="p-2 m-2 border-black border-2 rounded-md bg-green-500 transition ease-linear duration-300 scale-100 transform hover:scale-110"
            type="button"
          >
            OK
          </button>
          <button
            onClick={handleClose}
            className="p-2 m-2 border-black border-2 rounded-md bg-red-500 transition ease-linear duration-300 scale-100 transform hover:scale-110"
            type="button"
          >
            Cancel
          </button>
        </>
      );
    }
  );
  return (
    <dialog
      className={`sm:w-6/12 w-full p-2 border-2 border-gray-400 rounded-md bg-red-200 backdrop-blur-sm `}
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

export default AuthorsDialog;
