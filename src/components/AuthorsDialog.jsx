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
        <header>Selected author: {selectedAuthor}</header>
        <form>
          <section className="grid grid-cols-2 gap-4">
            <header>Picture</header>
            <header>Details</header>
            {data.allAuthors.map((author) => (
              <>
                <img className="w-1/4" src={image} alt="swag"></img>
                <div>
                  <ul>
                    <li>Name: {author.name}</li>
                    <li>Born: {author.born}</li>
                    <li>Total Books: {author.bookCount}</li>
                  </ul>
                </div>
              </>
            ))}
          </section>
          {/*<table>
            <tr>
              <th>Author</th>
              <th>Born</th>
              <th>Books</th>
            </tr>
            {data.allAuthors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>2000</td>
                <td>5</td>
              </tr>
            ))}
          </table>*/}
          <button
            onClick={handleOk}
            className="p-2 border-black border-2 rounded-md bg-white"
          >
            OK
          </button>
          <button
            onClick={handleClose}
            className="p-2 border-black border-2 rounded-md bg-red-500"
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
