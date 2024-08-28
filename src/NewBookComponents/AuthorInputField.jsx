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
  <div className="my-2 flex justify-between border-b-2 border-b-gray-400 p-2">
    <div className="flex flex-col">
      <span className="flex min-w-80">
        <p className=" text-xl">{label} </p>
        <p className="h-14 w-32 break-words px-2 text-xl font-semibold">
          {value}
        </p>
      </span>

      <button
        className="my-2 max-w-14 flex-1 rounded-md border-2 border-black bg-white"
        type="button"
        onClick={() => setAuthor("")}
      >
        Clear
      </button>
    </div>
    <div className="flex w-full flex-col  items-end">
      <button
        className=" mb-1 w-60  scale-100 rounded-md border-2 border-black bg-white p-2 text-black transition duration-300 ease-linear hover:bg-black hover:text-white "
        type="button"
        onClick={() => {
          setAuthorsDialogOpen(true);
        }}
      >
        Select an existing author
      </button>
      <button
        className="mt-1 w-60 scale-100 rounded-md border-2 border-black bg-white p-2 duration-300 ease-linear hover:bg-black hover:text-white"
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
