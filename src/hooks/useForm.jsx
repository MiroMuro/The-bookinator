import { useState } from "react";

const useForm = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = (event) => {
    let { name, value } = event.target;
    //Prevent the user from entering anything other than numbers in the published field.
    if (name === "published") {
      value = value.replace(/[^0-9]/g, "");
    }
    if (name !== "genres") {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setAuthor = (author) => {
    setState((prev) => ({ ...prev, author: author }));
  };
  //Handle adding a genre to the list of genres, and reset the genre input field.
  //In case of a genre input, add the genre to the list of genres.
  const addGenre = (event) => {
    if (state.genre === "" || state.genres.includes(state.genre))
      event.preventDefault();
    setState((prev) => ({ ...prev, genres: state.genres.concat(state.genre) }));
    setState((prev) => ({ ...prev, genre: "" }));
  };

  const handleGenreDeletion = (genre) => {
    setState((prev) => ({
      ...prev,
      genres: state.genres.filter((g) => g !== genre),
    }));
  };
  const reset = () => setState(initialState);
  return [state, handleChange, reset, addGenre, handleGenreDeletion, setAuthor];
};

export default useForm;
