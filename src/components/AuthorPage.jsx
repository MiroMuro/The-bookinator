const AuthorPage = ({ author }) => {
  return (
    <div className="flex flex-col w-8/12 m-auto">
      <h1 className="text-3xl font-semibold text-center">
        Author: {author.name}
      </h1>
      <div className="flex flex-col bg-red-200 border-gray-400 border-2 rounded-md w-5/12 m-auto mt-2">
        <h1 className="my-2 ml-2 font-semibold">Books by the author</h1>
        <table className="authorsTable">
          <thead>
            <tr>
              <th className="py-3 bg-red-400">Title</th>
              <th className="py-3 bg-red-400">Published</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {author.books.map((book) => (
              <tr key={book.id} className="authorsTableRow">
                <td className="py-3 px-6">{book.title}</td>
                <td className="py-3 px-6">{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AuthorPage;
