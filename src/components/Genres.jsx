import PropTypes from "prop-types";

const Genres = ({ genres, setCurrentGenre }) => {
  const containerStyle = {
    border: "3px solid #fff",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      Filter by Genre:
      {genres.map((genre) => (
        <button
          key={genre}
          style={{ marginLeft: "5px" }}
          onClick={() => setCurrentGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
Genres.propTypes = {
  genres: PropTypes.array.isRequired,
  setCurrentGenre: PropTypes.func.isRequired,
};

export default Genres;
