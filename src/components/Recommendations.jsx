import { useQuery } from "@apollo/client";
import { GET_USER, ALL_BOOKS } from "./queries";
const Recommendations = () => {
  const userInfo = useQuery(GET_USER);

  const favoriteGenre = userInfo.loading ? "" : userInfo.data.me.favoriteGenre;

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });
  if (userInfo.loading || loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Recommendations</h1>
      <div>
        books in your favorite genre, <strong>{favoriteGenre}</strong>{" "}
        <div>
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Published</th>
              </tr>
              {data.allBooks.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>
                    {a.author.name}, born: {a.author.born}
                  </td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Recommendations;
