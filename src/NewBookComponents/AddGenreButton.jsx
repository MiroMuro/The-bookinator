const AddGenreButton = ({
  addGenre,
  genre,
  genres,
  isDuplicateGenre,
  setIsDuplicateGenre,
}) => {
  //Ekaks tsekataan onko genre tyhjä, onko genre jo listassa ja onko genrejä max määrä.
  const isGenreEmpty = genre === "";
  const isGenreDuplicate =
    genres.includes(genre.toLowerCase()) || isDuplicateGenre;
  const isGenreMax = genres.length >= 3;
  //Sitten asetetaan duplikaattimuuttujan tila.
  setIsDuplicateGenre(isGenreDuplicate);
  //Lopuksi tarkistetaan onko nappi disabloitu.
  const isDisabled = isGenreEmpty || isGenreDuplicate || isGenreMax;
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
