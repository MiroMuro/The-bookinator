import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";
import propTypes from "prop-types";
const GenresDropdown = ({ setCurrentGenre, currentGenre }) => {
  const genresResult = useQuery(ALL_GENRES);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentGenre("");
  };

  const handleGenreChange = (event) => {
    event.preventDefault();
    setCurrentGenre(event.target.value);
  };
  console.log("currentGenre", currentGenre);
  if (genresResult.loading) {
    return <div>loading...</div>;
  }
  return (
    <div
      data-test="genres-dropdown"
      className="mt-2 w-1/3 rounded-md border-2 border-gray-400  bg-red-200 p-2"
    >
      <div className="text-lg">
        {currentGenre
          ? `Currently selected genre: ${currentGenre}`
          : " No genre selected"}
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="genres">Choose genre </label>
        <select
          data-test="genre-dropdown"
          name="genres"
          id="genres"
          value={""}
          onChange={(e) => handleGenreChange(e)}
        >
          <option defaultValue={true}>-- Choose genre --</option>
          {genresResult.data.allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <button
          data-test="reset-filter-button"
          className="filterButton"
          type="submit"
          value="Filter"
        >
          Reset filter
        </button>
      </form>
    </div>
  );
};
GenresDropdown.propTypes = {
  setCurrentGenre: propTypes.func.isRequired,
  currentGenre: propTypes.string.isRequired,
};

export default GenresDropdown;
