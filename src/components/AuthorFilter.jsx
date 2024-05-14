const AuthorFilter = ({ authorToSearch, setAuthorToSearch }) => {
  const handleInput = (event) => {
    event.preventDefault();
    setAuthorToSearch(event.target.value);
  };

  return (
    <div className="my-2">
      <form>
        <label htmlFor="genres">Search author: </label>
        <input id="genres" name="genres" onChange={(e) => handleInput(e)} />
      </form>
    </div>
  );
};

export default AuthorFilter;
