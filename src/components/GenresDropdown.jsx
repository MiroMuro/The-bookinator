import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";
const GenresDropdown = ({ genres, setCurrentGenre }) => {
  const containerStyle = {
    border: "3px solid #fff",
    marginTop: "10px",
  };
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
    <div style={containerStyle}>
      Currently selected genre: {selectedGenre}
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
