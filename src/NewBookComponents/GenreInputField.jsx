import PropTypes from "prop-types";

const GenreInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  isDuplicateGenre,
  isTooLongGenre,
}) => {
  return (
    <div className="my-2 flex justify-between p-2 ">
      <label
        htmlFor="genresInput"
        data-test="duplicate-genre-label"
        className={`absolute ${
          isDuplicateGenre
            ? "-translate-y-6 text-red-700 opacity-100 duration-500"
            : " -translate-y-6 opacity-0 duration-500"
        }`}
      >
        Duplicate genre!
      </label>
      <label
        htmlFor="genresInput"
        data-test="too-long-genre-label"
        className={`absolute ${
          isTooLongGenre
            ? "translate-y-6 text-red-700 opacity-100 duration-500"
            : " translate-y-6 opacity-0 duration-500"
        }`}
      >
        Genre name is too long!
      </label>
      <input
        className={`w-60 ${
          isDuplicateGenre
            ? "border-2 border-red-500 outline-none   transition duration-300"
            : "border-2  border-x-gray-200  border-b-black border-t-gray-200"
        }`}
        data-test="genre-input"
        id="genresInput"
        autoComplete="off"
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
GenreInputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isDuplicateGenre: PropTypes.bool.isRequired,
  isTooLongGenre: PropTypes.bool.isRequired,
};

export default GenreInputField;
