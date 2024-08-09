import { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import image from "../static/images/book.jpg";

const AuthorsDialog = ({
  authors,
  authorToSearch,
  setAuthorToSearch,
  token,
  open,
}) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorSearchInput, setAuthorSearchinput] = useState("");
  const dialogRef = useRef(null);
  const handleClose = () => setDialogOpen(false);
  const handleOk = () => {
    setAuthorToSearch(selectedAuthor);
    //setDialogOpen(false);
  };
  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);
  const AuthorsGrid = ({ loading, data, error }) => {
    if (loading) return <div>Loading authors...</div>;
    if (error) return <div>An error has occured. Please try again later.</div>;
    return (
      <>
        <h1 className="font-bold">Authors</h1>
        <header className="flex py-2">
          Selected author:{" "}
          <p className="border-b-2 px-2 font-semibold border-black">
            {selectedAuthor}
          </p>
        </header>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={authorSearchInput}
          onChange={(e) => setAuthorSearchinput(e.target.value)}
        />
        <form>
          <section className="grid grid-cols-2 gap-4">
            <header>Picture</header>
            <header>Details</header>
            {data.allAuthors.map((author) => (
              <>
                <img className="w-2/4" src={image} alt="swag"></img>
                <div>
                  <ul>
                    <li>Name: {author.name}</li>
                    <li>Born: {author.born}</li>
                    <li>Total Books: {author.bookCount}</li>
                    <li>
                      <button
                        className=" border-black bg-white border-2 rounded-md p-2"
                        onClick={() => setSelectedAuthor(author.name)}
                      >
                        Select Author
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ))}
          </section>

          <button
            onClick={handleOk}
            className="p-2 m-2 border-black border-2 rounded-md bg-white"
          >
            OK
          </button>
          <button
            onClick={handleClose}
            className="p-2 m-2 border-black border-2 rounded-md bg-red-500"
          >
            Cancel
          </button>
        </form>
      </>
    );
  };
  return (
    <div className="">
      <dialog
        className="sm:w-6/12 w-full p-2 border-2 border-gray-300 rounded-md bg-red-200"
        ref={dialogRef}
      >
        <AuthorsGrid data={data} loading={loading} error={error} />
      </dialog>
    </div>
  );
};

export default AuthorsDialog;
