import { useState } from "react";

const GenresDropdown = ({ genres, setCurrentGenre }) => {
  const containerStyle = {
    border: "3px solid #fff",
    marginTop: "10px",
  };
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleGenreChange = (event) => {
    event.preventDefault();
    setSelectedGenre(event.target.value);
  };
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
          {genres.map((genre) => (
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
