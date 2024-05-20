import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
import AuthorFilter from "./AuthorFilter";
import { useMemo, useState } from "react";
const Authors = ({ token }) => {
  const result = useQuery(ALL_AUTHORS);

  const [authorToSearch, setAuthorToSearch] = useState("");

  console.log("Author to search for: ", authorToSearch);
  if (result.loading) {
    return <div>loading...</div>;
  }
  console.log("RESULT: ", result);
  const authors = result.data.allAuthors;

  console.log("AUTHROS: ", authors);
  const filteredAuthors = () => {
    return authors.filter((author) =>
      author.name.toLowerCase().includes(authorToSearch)
    );
  };
  console.log(filteredAuthors());
  return (
    <div className=" flex flex-col justify-start items-start-h-screen w-8/12">
      <div>
        <h2>HELLO</h2>
        <AuthorFilter
          authorToSearch={authorToSearch}
          setAuthorToSearch={setAuthorToSearch}
        />
      </div>
      {!token && (
        <table className="authorsTable ">
          <thead className="">
            <tr className="w-8/12">
              <th className="py-3 bg-red-400">Author</th>
              <th className="py-3 bg-red-400">Born</th>
              <th className="py-3 bg-red-400">Books</th>
            </tr>
          </thead>
          {/*
          <tbody className="text-center">
            {authors.map((author) => (
              <tr key={author.id} className="authorsTableRow">
                <td className="py-3 px-6">{author.name}</td>
                <td className="py-3 px-6">{author.born}</td>
                <td className="py-3 px-6">{author.bookCount}</td>
              </tr>
            ))}
          </tbody>
            */}
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
      )}
      {token && (
        <div>
          <h2>authors</h2>
          <table>
            <tbody>
              <tr>
                <th>Author</th>
                <th>
                  <strong>born</strong>
                </th>
                <th>
                  <strong>books</strong>
                </th>
              </tr>
              {authors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <BirthyearForm authors={authors} />
        </div>
      )}
    </div>
  );
};

export default Authors;
