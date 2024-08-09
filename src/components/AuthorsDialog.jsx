import { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import image from "../static/images/book.jpg";

const AuthorsDialog = ({
  authorToSearch,
  setAuthorToSearch,
  token,
  open,
  setAuthorsDialogOpen,
}) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorSearchInput, setAuthorSearchinput] = useState("");
  const dialogRef = useRef(null);
  const handleClose = () => setAuthorsDialogOpen(false);
  const handleOk = () => {
    console.log("Haloo");
    setSelectedAuthor(selectedAuthor);
    setAuthorsDialogOpen(false);
  };

  const filterAuthors = (authors, searchTerm) => {
    console.log("Authors ", authors);
    return authors.filter((author) =>
      author.name.toLowerCase().includes(searchTerm)
    );
  };

  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  const AuthorsGrid = ({
    data,
    filterAuthors,
    error,
    loading,
    authorSearchInput,
  }) => {
    if (loading) return <div>Loading authors...</div>;
    if (error) return <div>An error has occured. Please try again later.</div>;
    const authors = data.allAuthors;
    const filteredAuthors = filterAuthors(authors, authorSearchInput);
    return (
      <>
        <h1 className="font-bold text-2xl">Authors</h1>
        <header className="flex py-2 text-xl">
          Selected author:{" "}
          <p className="border-b-2 px-2 font-semibold border-black">
            {selectedAuthor}
          </p>
        </header>
        <section className="py-2 text-xl">
          <label htmlFor="author">Search: </label>
          <input
            type="text"
            id="author"
            name="author"
            value={authorSearchInput}
            onChange={(e) => setAuthorSearchinput(e.target.value)}
          />
        </section>
        <section className="grid grid-cols-2 gap-4 py-2 my-2 border-2 border-gray-400 bg-gray-200">
          <header className="text-xl px-1 border-r-2 border-gray-400 overflow">
            Author
          </header>
          <header className="text-xl px-1">Info</header>
        </section>
        <section>
          <form className="h-96 overflow-y-scroll ">
            <section className="grid grid-cols-2 gap-4">
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
                      <li className="py-1">Total Books: {author.bookCount}</li>
                      <li className="py-1">
                        <button
                          className=" border-black bg-white border-2 rounded-md p-2"
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
          className="p-2 m-2 border-black border-2 rounded-md bg-white"
          type="button"
        >
          OK
        </button>
        <button
          onClick={handleClose}
          className="p-2 m-2 border-black border-2 rounded-md bg-red-500"
          type="button"
        >
          Cancel
        </button>
      </>
    );
  };
  return (
    <div className="">
      <dialog
        className="sm:w-6/12 w-full p-2 border-2 border-gray-400 rounded-md bg-red-200"
        ref={dialogRef}
      >
        <AuthorsGrid
          data={data}
          filterAuthors={filterAuthors}
          loading={loading}
          error={error}
          authorSearchInput={authorSearchInput}
        />
      </dialog>
    </div>
  );
};

export default AuthorsDialog;
