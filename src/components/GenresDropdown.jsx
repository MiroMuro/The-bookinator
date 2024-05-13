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
  console.log("Selected Genre: ", selectedGenre);
  return (
    <div style={containerStyle}>
      Filter by Genre: {selectedGenre}
      <form>
        <label for="genres">Choose genre</label>
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
          type="submit"
          value="Filter"
          onClick={() => setCurrentGenre(selectedGenre)}
        />
      </form>
    </div>
  );
};
export default GenresDropdown;
