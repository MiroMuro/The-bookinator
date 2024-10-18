import PropTypes from "prop-types";
const AuthorFilter = ({ setAuthorToSearch }) => {
  const handleInput = (event) => {
    event.preventDefault();
    setAuthorToSearch(event.target.value);
  };

  return (
    <div
      data-test="author-filter-div"
      className=" my-4  w-full  md:w-8/12 lg:max-w-lg rounded-md border-2 border-gray-400 bg-red-200 p-2  "
    >
      <form>
        <label htmlFor="genres">Search: </label>
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
