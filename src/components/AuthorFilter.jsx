import PropTypes from "prop-types";
const AuthorFilter = ({ setAuthorToSearch }) => {
  const handleInput = (event) => {
    event.preventDefault();
    setAuthorToSearch(event.target.value);
  };

  return (
    <div
      data-test="author-filter-div"
      className=" my-4 w-full min-w-72 rounded-md border-2 border-gray-400 bg-red-200 p-4 sm:w-5/12 "
    >
      <form>
        <label htmlFor="genres">Search for an author: </label>
        <input
          className="border-2  border-x-gray-200  border-b-black border-t-gray-200"
          id="genres"
          name="genres"
          onChange={(e) => handleInput(e)}
        />
      </form>
    </div>
  );
};

AuthorFilter.propTypes = {
  setAuthorToSearch: PropTypes.func.isRequired,
};

export default AuthorFilter;
