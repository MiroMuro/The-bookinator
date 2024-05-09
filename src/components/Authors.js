import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import BirthyearForm from "./BirthyearForm";
const Authors = ({ token }) => {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }
  const authors = result.data.allAuthors;

  return (
    <body className=" flex justify-center items-center-h-screen">
      {!token && (
        <table className="shadow-2xl border-2 border-gray-400 w-5/12 ">
          <thead className="">
            <tr className="w-8/12">
              <th className="py-3 bg-red-400">Author</th>
              <th className="py-3 bg-red-400">Born</th>
              <th className="py-3 bg-red-400">Books</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {authors.map((author) => (
              <tr className=" bg-red-100 hover:bg-red-200 cursor-pointer duration-300">
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
    </body>
  );
};

export default Authors;
