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
    <div>
      {authors && (
        <div>
          <h1>Update birthyear</h1>
          <form onSubmit={submit}>
            <div>
              name
              <select
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
            <div>
              born
              <input
                value={birthyear}
                onChange={({ target }) => setBirthyear(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default BirthyearForm;
