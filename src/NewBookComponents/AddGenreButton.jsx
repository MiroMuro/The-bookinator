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
      className="addGenreButton"
      onClick={isDisabled ? null : addGenre}
      disabled={isDisabled}
    >
      Add genre. Max 3.
    </button>
  );
};

export default AddGenreButton;
