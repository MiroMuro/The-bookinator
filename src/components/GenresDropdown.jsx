import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";
const GenresDropdown = ({ setCurrentGenre, currentGenre }) => {
  const genresResult = useQuery(ALL_GENRES);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("event.target.value", event.target.value);
    setCurrentGenre("");
  };

  const handleGenreChange = (event) => {
    event.preventDefault();
    console.log("event.target.value", event.target.value);
    setCurrentGenre(event.target.value);
  };
  console.log("currentGenre", currentGenre);
  if (genresResult.loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-1/3 bg-red-200 rounded-md border-2 mt-2  p-2 border-gray-400">
      {currentGenre
        ? `Currently selected genre: ${currentGenre}`
        : " No genre selected"}
      <form onSubmit={(e) => handleSubmit(e)}>
        <label for="genres">Choose genre </label>
        <select
          name="genres"
          id="genres"
          value={""}
          onChange={(e) => handleGenreChange(e)}
        >
          <option selected>-- Choose genre --</option>
          {genresResult.data.allGenres.map((genre) => (
            <option value={genre}>{genre}</option>
          ))}
        </select>
        <button className="filterButton " type="submit" value="Filter">
          Reset filter
        </button>
      </form>
    </div>
  );
};
export default GenresDropdown;
