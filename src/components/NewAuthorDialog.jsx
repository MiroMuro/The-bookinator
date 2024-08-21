import { useEffect, useRef } from "react";
import useAddAuthorForm from "../hooks/useAddAuthorForm";
import StatusBar from "../NewAuthorComponents/StatusBar";
const NewAuthorDialog = ({ open, setDialogOpen }) => {
  const dialogRef = useRef(null);
  const {
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    handleBlur,
    addAuthorStatus,
  } = useAddAuthorForm();
  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  const isFormValid = () => {
    if (errorMessage.isNameErrorMessage || errorMessage.isBornErrorMessage) {
      return true;
    } else if (
      !errorMessage.isNameErrorMessage &&
      !errorMessage.isBornErrorMessage
    ) {
      return false;
    }
  };

  const ErrorMessageComponent = ({ message, showErrorMessage }) => {
    if (!showErrorMessage) return null;
    else {
      return (
        <>
          {message.map((msg) => (
            <div className="text-sm  text-red-500 max-w-44 flex-grow-0 break-words">
              {msg}
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <dialog className="newAuthorDialog" ref={dialogRef}>
      <form id="addAuthorForm">
        <header className="flex justify-between text-2xl p-4 h-24 border-b-2 border-gray-400">
          <h2>Add a new author</h2>{" "}
          <StatusBar initialStatus={addAuthorStatus} />
        </header>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Name:</aside>
          <main className="flex flex-col w-1/3">
            <input
              id="nameInput"
              className="border-b-2 border-gray-400 w-11/12"
              name="name"
              value={author.name}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleBlur(e)}
            />
            <ErrorMessageComponent
              message={errorMessage.name}
              showErrorMessage={errorMessage.isNameErrorMessage}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Born:</aside>
          <main className="flex flex-col w-1/3">
            <input
              id="bornInput"
              className="border-b-2 border-gray-400 w-11/12"
              name="born"
              value={author.born}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleBlur(e)}
            />
            <ErrorMessageComponent
              message={errorMessage.born}
              showErrorMessage={errorMessage.isBornErrorMessage}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Description:</aside>
          <main className="relative">
            <textarea
              className="h-40 border-b-2 border-gray-400"
              name="description"
              value={author.description}
              placeholder="Enter a description. Max 600 characters."
              onChange={(e) => handleChange(e)}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Image:</aside>
          <main>
            <input type="file" accept="image/*" />
          </main>
        </section>
        <section className="flex justify-between p-2 mb-4">
          <button
            className={`border-2 border-black bg-red-500 p-2 rounded-md transition ease-linear duration-300 hover:scale-110`}
            type="button"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="border-2 border-black bg-green-500 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 transition ease-linear duration-300 hover:scale-110 "
            type="button"
            id="addAuthorButton"
            onClick={handleManualSubmit}
            disabled={isFormValid()}
          >
            Add author
          </button>
        </section>
      </form>
    </dialog>
  );
};

export default NewAuthorDialog;
