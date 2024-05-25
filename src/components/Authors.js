import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, AUTHOR_UPDATED } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useEffect, useState } from "react";
const Authors = ({ token }) => {
  const { loading, error, data, subscribeToMore } = useQuery(ALL_AUTHORS);

  const [authorToSearch, setAuthorToSearch] = useState("");

  if (loading) {
    return <div>loading...</div>;
  }
  //Initially all authors are displayed
  const authors = data.allAuthors;
  //Filter authors based on the search input
  const filteredAuthors = () => {
    return authors.filter((author) =>
      author.name.toLowerCase().includes(authorToSearch)
    );
  };
  console.log("Authors", authors);
  return (
    <div className=" flex flex-col justify-start items-start-h-screen w-8/12">
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

      {token && (
        <div>
          <BirthyearForm authors={authors} />
        </div>
      )}
    </div>
  );
};

export default Authors;
