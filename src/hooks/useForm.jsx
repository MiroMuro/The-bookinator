import { useState } from "react";

const useForm = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name !== "genres") setState((prev) => ({ ...prev, [name]: value }));
  };
  //Handle adding a genre to the list of genres, and reset the genre input field.
  //In case of a genre input, add the genre to the list of genres.
  const addGenre = (event) => {
    if (state.genre === "" || state.genres.includes(state.genre))
      event.preventDefault();
    setState((prev) => ({ ...prev, genres: state.genres.concat(state.genre) }));
    setState((prev) => ({ ...prev, genre: "" }));
  };
  const reset = () => setState(initialState);
  return [state, handleChange, reset, addGenre];
};

export default useForm;
