import PropTypes from "prop-types";

const AddGenreButton = ({
  addGenre,
  genre,
  genres,
  isDuplicateGenre,
  setIsDuplicateGenre,
  setIsTooLongGenre,
}) => {
  //Ekaks tsekataan onko genre tyhjä, onko genre jo listassa ja onko genrejä max määrä.
  const isGenreTooLong = genre.length > 30;
  const isGenreEmpty = genre === "";
  const isGenreDuplicate =
    genres.includes(genre.toLowerCase()) || isDuplicateGenre;
  const isGenreMax = genres.length >= 3;
  //Sitten asetetaan duplikaattimuuttujan tila.
  setIsDuplicateGenre(isGenreDuplicate);
  //Sitten asetetaan onko genre liian pitkä.
  setIsTooLongGenre(isGenreTooLong);
  //Lopuksi tarkistetaan onko nappi disabloitu.
  const isDisabled =
    isGenreEmpty || isGenreDuplicate || isGenreMax || isGenreTooLong;
  return (
    <button
      type="button"
      data-test="add-genre-button"
      className="addGenreButton"
      onClick={isDisabled ? null : addGenre}
      disabled={isDisabled}
    >
      Add genre. Max 3.
    </button>
  );
};
AddGenreButton.propTypes = {
  addGenre: PropTypes.func.isRequired,
  genre: PropTypes.string.isRequired,
  genres: PropTypes.array.isRequired,
  isDuplicateGenre: PropTypes.bool.isRequired,
  setIsDuplicateGenre: PropTypes.func.isRequired,
  setIsTooLongGenre: PropTypes.func.isRequired,
};

export default AddGenreButton;
