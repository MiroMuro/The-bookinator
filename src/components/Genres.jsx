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
          style={{ marginLeft: "5px" }}
          onClick={() => setCurrentGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
export default Genres;
