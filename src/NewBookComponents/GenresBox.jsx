import PropTypes from "prop-types";

const GenresBox = ({ genres, handleGenreDeletion }) => {
  return (
    <div className="relative flex border-b-2 border-gray-400  bg-red-200 ">
      <label className="absolute -top-4 left-2 bg-red-200 text-xl">
        Genres
      </label>
      <div className="w-full  break-words" data-test="genres-box">
        <ul className="my-2 flex flex-wrap py-2">
          {genres.map((genre, index) => (
            <li
              key={index}
              className="relative m-1 w-min rounded-md border-2 border-white p-1 text-center transition duration-300 ease-linear hover:scale-110 hover:bg-red-400 hover:text-white"
            >
              {genre}
              <button
                className="absolute right-0 top-0 flex size-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                onClick={() => handleGenreDeletion(genre)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
GenresBox.propTypes = {
  genres: PropTypes.array.isRequired,
  handleGenreDeletion: PropTypes.func.isRequired,
};

export default GenresBox;
