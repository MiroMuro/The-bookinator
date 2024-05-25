const AuthorFilter = ({ authorToSearch, setAuthorToSearch }) => {
  const handleInput = (event) => {
    event.preventDefault();
    setAuthorToSearch(event.target.value);
  };

  return (
    <div className=" my-4 p-4 w-5/12 border-gray-400 bg-red-200 border-2 rounded-md">
      <form>
        <label htmlFor="genres">Search for an author: </label>
        <input
          className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
          id="genres"
          name="genres"
          onChange={(e) => handleInput(e)}
        />
      </form>
    </div>
  );
};

export default AuthorFilter;
