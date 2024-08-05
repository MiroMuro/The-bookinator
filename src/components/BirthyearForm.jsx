import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "./queries";
const BirthyearForm = ({ authors }) => {
  const [birthyear, setBirthyear] = useState(0);
  const [selectedAuthorName, setSelectedAuthorName] = useState(authors[0].name);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    onCompleted: (data) => {
      console.log("Author updated", data);
    },
  });
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    let errorMsg = "";
    let shouldPlayAnimation = false;
    let shouldDisableButton = false;
    if (!birthyear) {
      shouldDisableButton = true;
    } else if (birthyear.length > 4) {
      errorMsg = "Birthyear must be 4 digits or less.";
      shouldPlayAnimation = true;
      shouldDisableButton = true;
    } else if (birthyear > currentYear) {
      errorMsg = "Birthyear cannot be in the future.";
      shouldPlayAnimation = true;
      shouldDisableButton = true;
    } else if (birthyear < 0) {
      errorMsg = "Birthyear cannot be negative.";
      shouldPlayAnimation = true;
      shouldDisableButton = true;
    }
    setPlayAnimation(shouldPlayAnimation);
    setIsButtonDisabled(shouldDisableButton);
    setErrorMessage(errorMsg);
  }, [birthyear]);

  const submit = async (event) => {
    event.preventDefault();
    updateAuthor({
      variables: { name: selectedAuthorName, born: parseInt(birthyear) },
    });
    setSelectedAuthorName(authors[0].name);
    setBirthyear("");
  };
  const handleBeforeInput = (event) => {
    console.log("Play animation", playAnimation);
    const { data } = event;
    //If the input is not a number, prevent the default action and play the animation.
    if (!/^\d+$/.test(data)) {
      setPlayAnimation(true);
      setErrorMessage("Only numbers are allowed.");
      event.preventDefault();
    } else {
      setPlayAnimation(false);
    }
  };

  const handleBirthyearChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    setBirthyear(numericValue);
  };

  if (!authors || authors.length === 0) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col bg-red-200 border-gray-400 border-2 rounded-md w-full mt-2 min-w-72 ">
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
          <div className="flex justify-between m-2 relative">
            <p>Birthyear: </p>
            <p
              className={`${
                playAnimation
                  ? "absolute right-1 top-7 font-extralight  text-red-600 duration-500 transition ease-linear transform opacity-100"
                  : "absolute right-1 top-7 font-extralight text-red-600 duration-500 transition ease-linear transform opacity-0"
              }`}
            >
              {errorMessage}
            </p>
            <input
              className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
              maxLength={4}
              type="text"
              pattern="\d*"
              inputMode="numeric"
              value={birthyear}
              onBeforeInput={(e) => handleBeforeInput(e)}
              onChange={(e) => handleBirthyearChange(e)}
            />
          </div>
          <button
            disabled={isButtonDisabled}
            className="updateAuthorButton"
            type="submit"
          >
            Update author
          </button>
        </form>
      </div>
    </>
  );
};
export default BirthyearForm;
