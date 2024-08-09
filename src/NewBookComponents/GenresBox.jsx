const GenresBox = ({ genres, handleGenreDeletion }) => {
  return (
    <div className="flex relative border-b-2 border-gray-400  bg-red-200 ">
      <label className="absolute -top-4 left-2 bg-red-200">Genres</label>
      <div className="w-full  break-words">
        <ul className="flex flex-wrap my-2">
          {genres.map((genre, index) => (
            <li
              key={index}
              className="relative rounded-md border-white border-2 w-min p-1 m-1 text-center hover:bg-red-400 hover:text-white transition duration-300 ease-linear transform hover:scale-110"
            >
              {genre}
              <button
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
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

export default GenresBox;
