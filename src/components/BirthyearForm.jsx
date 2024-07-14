import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "./queries";
const BirthyearForm = ({ authors }) => {
  const [birthyear, setBirthyear] = useState("");
  const [selectedAuthorName, setSelectedAuthorName] = useState(authors[0].name);
  console.log("updateAuthor", selectedAuthorName);

  //Function to update the author's birthyear
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    onError: (error, data) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log("Error messages", messages);
    },
    update: (cache, response) => {
      //Update cache with the edited author.
      cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
        const updatedAuthor = response.data.editAuthor;
        const authors = data.allAuthors.map((author) =>
          author.name === updatedAuthor.name ? updatedAuthor : author
        );
        return { allAuthors: authors };
      });
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    updateAuthor({
      variables: { name: selectedAuthorName, born: parseInt(birthyear) },
    });
    setSelectedAuthorName(authors[0].name);
    setBirthyear("");
  };
  return (
    <>
      {authors && (
        <div className="flex flex-col bg-red-200 border-gray-400 border-2 rounded-md w-full mt-2 sm:w-5/12">
          <h1 className="my-2 ml-2 font-semibold">
            Update birthyear of an author
          </h1>
          <form onSubmit={submit}>
            <div className="flex justify-between m-2">
              <p>Select an author</p>
              <select
                className="border-black border-2 rounded-lg p-1 hover:bg-gray-300"
                onChange={({ target }) => setSelectedAuthorName(target.value)}
                value={selectedAuthorName}
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between m-2">
              <p>Birthyear: </p>
              <input
                className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
                maxLength={4}
                value={birthyear}
                onChange={({ target }) => setBirthyear(target.value)}
              />
            </div>
            <button
              className="rounded-lg bg-white border-solid border-2 border-black m-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-200 scale-100 transform hover:scale-110"
              type="submit"
            >
              Update author
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default BirthyearForm;
