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
    <p>
      {" "}
      {label} <br /> <p className="font-semibold">{value}</p>
    </p>
    <div className="flex flex-col items-end  w-full">
      <button
        className="max-w-33 mb-1 border-black border-2 bg-white text-black rounded-md p-2 transition ease-linear duration-300 scale-100 transform hover:bg-black hover:text-white "
        type="button"
        onClick={() => {
          setAuthorsDialogOpen(true);
        }}
      >
        Select an existing author
      </button>
      <button
        className="max-w-33 min-w-33 mt-1 border-black border-2 bg-white rounded-md p-2 ease-linear duration-300 scale-100 transform hover:bg-black hover:text-white"
        type="button"
      >
        {" "}
        Add a new Author
      </button>
    </div>

    {/*<input
      autoComplete="off"
      label={label}
      name={name}
      type={type}
      className="border-b-2  border-b-black  border-t-2 border-t-gray-200 border-r-2 border-r-gray-200 border-l-2 border-l-gray-200"
      value={value}
      onChange={onChange}
    />*/}

    <AuthorsDialog
      setAuthor={setAuthor}
      open={authorsDialogOpen}
      setAuthorsDialogOpen={setAuthorsDialogOpen}
    />
  </div>
);
export default AuthorInputField;
