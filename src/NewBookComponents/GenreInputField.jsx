import { useState } from "react";
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
    <div className="flex my-2 justify-between p-2 ">
      <label
        for="genresInput"
        className={`absolute ${
          isDuplicateGenre
            ? "duration-500 transform -translate-y-6 opacity-100 text-red-700"
            : "duration-500 transform -translate-y-6 opacity-0 fill-mode-forwards"
        }`}
      >
        Duplicate genre!
      </label>
      <label
        for="genresInput"
        className={`absolute ${
          isTooLongGenre
            ? "duration-500 transform translate-y-6 opacity-100 text-red-700"
            : "duration-500 transform translate-y-6 opacity-0 fill-mode-forwards"
        }`}
      >
        Genre name is too long!
      </label>
      <input
        className={`${
          isDuplicateGenre
            ? "border-2 border-red-500 outline-none   transition duration-300"
            : "border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
        }`}
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
export default GenreInputField;
