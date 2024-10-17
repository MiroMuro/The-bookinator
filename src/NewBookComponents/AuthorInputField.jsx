import AuthorsDialog from "../components/AuthorsDialog";
import NewAuthorDialog from "../components/NewAuthorDialog";
import PropTypes from "prop-types";

const AuthorInputField = ({
  label,
  value,
  authorsDialogOpen,
  setAuthorsDialogOpen,
  setAuthor,
  addAuthorDialogOpen,
  setAddAuthorDialogOpen,
}) => (
  <div className="my-2 flex flex-col justify-between border-b-2 border-b-gray-400 p-2 md:flex-col">
    <div className="flex flex-col md:w-full md:flex-row ">
      <span className="flex justify-between md:w-full md:items-center">
        <p className=" text-center text-xl">{label} </p>
        <p
          data-test="selected-author"
          className=" w-32 break-words px-2 text-center text-xl font-semibold md:grow md:text-lg  "
        >
          {value}
        </p>
        <button
          data-test="author-clear-button"
          className="flex-1 my-2 max-w-14 rounded-md border-2 border-black bg-white "
          type="button"
          onClick={() => setAuthor("")}
        >
          Clear
        </button>
      </span>
    </div>
    <div className="flex w-full flex-row justify-between md:my-2 md:flex-col md:items-end">
      <button
        data-test="author-select-button"
        className="md:w-6/12 md:mb-1 scale-100 rounded-md border-2 border-black bg-white p-2 text-black transition duration-300 ease-linear hover:bg-black hover:text-white "
        type="button"
        onClick={() => {
          setAuthorsDialogOpen(true);
        }}
      >
        Select author
      </button>
      <button
        data-test="author-add-button"
        className=" md:w-6/12 md:mt-1 scale-100 rounded-md border-2 border-black bg-white p-2 duration-300 ease-linear hover:bg-black hover:text-white"
        type="button"
        onClick={() => {
          setAddAuthorDialogOpen(true);
        }}
      >
        {" "}
        Add a new Author
      </button>
    </div>

    <NewAuthorDialog
      open={addAuthorDialogOpen}
      setDialogOpen={setAddAuthorDialogOpen}
    />
    <AuthorsDialog
      setAuthor={setAuthor}
      open={authorsDialogOpen}
      setAuthorsDialogOpen={setAuthorsDialogOpen}
    />
  </div>
);
AuthorInputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  authorsDialogOpen: PropTypes.bool.isRequired,
  setAuthorsDialogOpen: PropTypes.func.isRequired,
  setAuthor: PropTypes.func.isRequired,
  addAuthorDialogOpen: PropTypes.bool.isRequired,
  setAddAuthorDialogOpen: PropTypes.func.isRequired,
};
export default AuthorInputField;
