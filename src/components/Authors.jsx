import { useQuery } from "@apollo/client";
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

  const filterAuthors = (authors, authorToSearch) => {
    if (authors.length)
      return authors.filter((author) =>
        author.name.toLowerCase().includes(authorToSearch)
      );
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
      <AuthorsTable authors={filteredAuthors} />
    </div>
  );
};

export default Authors;
