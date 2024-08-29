import { useEffect, useRef } from "react";
import useAddAuthorForm from "../hooks/useAddAuthorForm";
import StatusBar from "../NewAuthorComponents/StatusBar";
import PropTypes from "prop-types";
const NewAuthorDialog = ({ open, setDialogOpen }) => {
  const dialogRef = useRef(null);
  const {
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    handleBlur,
    addAuthorStatus,
    handleFileChange,
    fileValidationMessage,
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
            <div
              key={msg}
              className="max-w-44  grow-0 break-words text-sm text-red-500"
            >
              {msg}
            </div>
          ))}
        </>
      );
    }
  };

  ErrorMessageComponent.propTypes = {
    message: PropTypes.array.isRequired,
    showErrorMessage: PropTypes.bool.isRequired,
  };
  return (
    <dialog
      data-test="add-author-dialog"
      className="newAuthorDialog"
      ref={dialogRef}
    >
      <form data-test="add-author-form" id="addAuthorForm">
        <header className="flex h-24 justify-between border-b-2 border-gray-400 p-4 text-2xl">
          <h2>Add a new author</h2>{" "}
          <StatusBar initialStatus={addAuthorStatus} />
        </header>
        <section className="flex justify-between border-b-2 border-gray-400 p-2 pb-8">
          <aside className="font-semibold">Name:</aside>
          <main className="flex w-1/3 flex-col">
            <input
              data-test="nameInput"
              id="nameInput"
              className="w-11/12 border-b-2 border-gray-400"
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
        <section className="flex justify-between border-b-2 border-gray-400 p-2 pb-8">
          <aside className="font-semibold">Born:</aside>
          <main className="flex w-1/3 flex-col">
            <input
              data-test="bornInput"
              id="bornInput"
              className="w-11/12 border-b-2 border-gray-400"
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
        <section className="flex justify-between border-b-2 border-gray-400 p-2 pb-8">
          <aside className="font-semibold">Description:</aside>
          <main className="relative">
            <textarea
              data-test="descriptionInput"
              className="h-40 border-b-2 border-gray-400"
              name="description"
              value={author.description}
              placeholder="Enter a description. Max 600 characters."
              onChange={(e) => handleChange(e)}
            />
          </main>
        </section>
        <section className="flex justify-between border-b-2 border-gray-400 p-2 pb-8">
          <aside className="font-semibold">Image:</aside>
          <main>
            <input
              data-test="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
            />
            <div
              data-test="filevalidationMessage"
              className={`${
                fileValidationMessage === "File validated successfully!"
                  ? "rounded-md border-2 border-black bg-green-400"
                  : "rounded-md border-2 border-black bg-red-500"
              }`}
            >
              {fileValidationMessage}
            </div>
          </main>
        </section>
        <section className="mb-4 flex justify-between p-2">
          <button
            className={`rounded-md border-2 border-black bg-red-500 p-2 transition duration-300 ease-linear hover:scale-110`}
            type="button"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            data-test="add-author-button"
            className="rounded-md border-2 border-black bg-green-500 p-2 transition duration-300 ease-linear hover:scale-110 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-50 "
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
NewAuthorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
};

export default NewAuthorDialog;
