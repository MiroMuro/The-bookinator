import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "./queries";
const BirthyearForm = ({ authors }) => {
  const [birthyear, setBirthyear] = useState("");
  const [name, setName] = useState("");

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
    console.log("update birthyear...");

    updateAuthor({ variables: { name, born: parseInt(birthyear) } });
    setName("");
    setBirthyear("");
  };
  return (
    <>
      {authors && (
        <div className="flex flex-col bg-red-200 border-gray-400 border-2 rounded-md w-5/12 mt-2">
          <h1 className="my-2 ml-2 font-semibold">Update birthyear</h1>
          <form onSubmit={submit}>
            <div className="flex justify-between m-2">
              <p>Name</p>
              <select
                className="border-black border-2 rounded-lg p-1 hover:bg-gray-300"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between m-2">
              <p>Born: </p>
              <input
                maxLength={4}
                value={birthyear}
                onChange={({ target }) => setBirthyear(target.value)}
              />
            </div>
            <button
              className="rounded-lg border-solid border-2 border-black m-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-200 scale-100 transform hover:scale-110"
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
