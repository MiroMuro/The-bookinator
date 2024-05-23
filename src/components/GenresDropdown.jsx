import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";
const GenresDropdown = ({ setCurrentGenre, currentGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const genresResult = useQuery(ALL_GENRES);

  const handleGenreChange = (event) => {
    event.preventDefault();
    setSelectedGenre(event.target.value);
  };

  if (genresResult.loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      Currently selected genre: {currentGenre}
      <form>
        <label for="genres">Choose genre </label>
        <select
          name="genres"
          id="genres"
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e)}
        >
          {genresResult.data.allGenres.map((genre) => (
            <option value={genre}>{genre}</option>
          ))}
        </select>
        <input
          className="filterButton"
          type="submit"
          value="Filter"
          onClick={() => setCurrentGenre(selectedGenre)}
        />
      </form>
    </div>
  );
};
export default GenresDropdown;
