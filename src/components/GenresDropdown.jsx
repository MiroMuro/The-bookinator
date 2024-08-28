import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";
import propTypes from "prop-types";
const GenresDropdown = ({ setCurrentGenre, currentGenre }) => {
  const {
    data: genresData,
    loading: genresLoading,
    error: genresError,
  } = useQuery(ALL_GENRES);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentGenre("");
  };

  const handleGenreChange = (event) => {
    setCurrentGenre(event.target.value);
  };
  const renderDropdownContent = () => {
    if (genresLoading) {
      return <div>loading...</div>;
    }
    if (genresError) {
      return <div>Error: {genresError.message}</div>;
    }
    const genres = genresData?.allGenres || [];
    return (
      <select
        data-test="genre-dropdown"
        name="genres"
        id="genres"
        value={currentGenre}
        onChange={handleGenreChange}
      >
        <option value="">-- Choose Genre --</option>
        {genres.length > 0 ? (
          genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))
        ) : (
          <option value="" disabled>
            -- No genres available --
          </option>
        )}
      </select>
    );
  };

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
        {renderDropdownContent()}
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
