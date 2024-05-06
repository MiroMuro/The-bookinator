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
    <div>
      <div>
        {!token && (
          <div>
            <table>
              <tbody>
                <tr>
                  <th></th>
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
          </div>
        )}
        {token && (
          <div>
            <h2>authors</h2>
            <table>
              <tbody>
                <tr>
                  <th></th>
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
    </div>
  );
};

export default Authors;
