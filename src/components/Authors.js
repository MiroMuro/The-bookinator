import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useState } from "react";
import TimeOutDialog from "./TimeOutDialog";
const Authors = ({ token, setToken }) => {
  const { loading, error, data, subscribeToMore } = useQuery(ALL_AUTHORS);
  const [authorToSearch, setAuthorToSearch] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);

  const handleClose = () => {
    setErrorDialogOpen(false);
  };
  if (loading) {
    return <div>Loading authors...</div>;
  } else if (
    //Triggered if login token has expired or is invalid. e.g user is timed out.
    error &&
    error.networkError.result &&
    error.networkError.result.name ===
      ("TokenExpiredError" || "JsonWebTokenError")
  ) {
    return (
      <TimeOutDialog
        open={errorDialogOpen}
        onClose={handleClose}
        errorMessage={error.networkError.result.messageForUser}
        setToken={setToken}
      />
    );
  } else if (error) {
    return <div>Error fetching the authors...</div>;
  } else {
    //Initially all authors are displayed
    const authors = data.allAuthors;
    //Filter authors based on the search input
    const filteredAuthors = () => {
      return authors.filter((author) =>
        author.name.toLowerCase().includes(authorToSearch)
      );
    };
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

        <table className="authorsTable ">
          <thead className="">
            <tr className="w-8/12">
              <th className="py-3 bg-red-400">Author</th>
              <th className="py-3 bg-red-400">Born</th>
              <th className="py-3 bg-red-400">Books</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredAuthors().map((author) => (
              <tr key={author.id} className="authorsTableRow">
                <td className="py-3 px-6">{author.name}</td>
                <td className="py-3 px-6">{author.born}</td>
                <td className="py-3 px-6">{author.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Authors;
