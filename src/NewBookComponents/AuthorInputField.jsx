import AuthorsDialog from "../components/AuthorsDialog";
const AuthorInputField = ({
  label,
  name,
  value,
  onChange,
  type,
  authorsDialogOpen,
  setAuthorsDialogOpen,
  setAuthor,
}) => (
  <div className="flex my-2 justify-between border-b-2 p-2 border-b-gray-400">
    <p> {label}</p> <br />
    <p>Selected author: {value}</p>
    <button
      className="border-black border-2 bg-white text-black rounded-md p-2"
      type="button"
      onClick={() => {
        setAuthorsDialogOpen(true);
      }}
    >
      Select an existing author
    </button>
    <input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
    />
    <button
      className="border-black border-2 bg-white rounded-md p-2"
      type="button"
    >
      {" "}
      Add a new Author
    </button>
    <AuthorsDialog
      setAuthor={setAuthor}
      open={authorsDialogOpen}
      setAuthorsDialogOpen={setAuthorsDialogOpen}
    />
  </div>
);
export default AuthorInputField;
