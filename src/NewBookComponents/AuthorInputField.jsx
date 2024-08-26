import AuthorsDialog from "../components/AuthorsDialog";
import NewAuthorDialog from "../components/NewAuthorDialog";
const AuthorInputField = ({
  label,

  value,

  authorsDialogOpen,
  setAuthorsDialogOpen,
  setAuthor,
  addAuthorDialogOpen,
  setAddAuthorDialogOpen,
}) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400">
    <div className="flex flex-col">
      <span className="flex min-w-80">
        <p className=" text-xl">{label} </p>
        <p className=" break-words text-xl px-2 font-semibold h-14 w-30">
          {value}
        </p>
      </span>

      <button
        className="flex-1 border-2 border-black rounded-md bg-white my-2 max-w-14"
        type="button"
        onClick={() => setAuthor("")}
      >
        Clear
      </button>
    </div>
    <div className="flex flex-col items-end  w-full">
      <button
        className=" mb-1 w-60  border-black border-2 bg-white text-black rounded-md p-2 transition ease-linear duration-300 scale-100 transform hover:bg-black hover:text-white "
        type="button"
        onClick={() => {
          setAuthorsDialogOpen(true);
        }}
      >
        Select an existing author
      </button>
      <button
        className="w-60 mt-1 border-black border-2 bg-white rounded-md p-2 ease-linear duration-300 scale-100 transform hover:bg-black hover:text-white"
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
export default AuthorInputField;
