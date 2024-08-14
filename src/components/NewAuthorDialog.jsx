import { useEffect, useRef, useState } from "react";
import useAddAuthorForm from "../hooks/useAddAuthorForm";

const NewAuthorDialog = ({ open, setDialogOpen }) => {
  const dialogRef = useRef(null);
  const [
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    setErrorMessage,
    validateBorn,
    validateName,
    handleBlur,
  ] = useAddAuthorForm();
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState();
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
  const ErrorMessageComponent = ({ message, showErrorMessage, key }) => {
    console.log("MEssage, ", message);
    console.log("isAddButtibnDisabled, ", isAddButtonDisabled);
    console.log(
      "errorMessage.isBornErrorMessage, ",
      errorMessage.isBornErrorMessage
    );
    console.log(
      "errorMessage.isNameErrorMessage, ",
      errorMessage.isNameErrorMessage
    );
    if (!showErrorMessage) return null;
    else {
      return (
        <div
          key={key}
          className={` transition ease-linear duration-300 ${
            showErrorMessage ? "scale-125" : "scale-100"
          }`}
        >
          {message.map((msg) => (
            <div className="text-xs p-2 text-red-500">{msg}</div>
          ))}
        </div>
      );
    }
  };

  return (
    <dialog className="newAuthorDialog" ref={dialogRef}>
      <form id="addAuthorForm">
        <header className="text-xl p-2 border-b-2 border-gray-400">
          Add a new Author
        </header>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Name:</aside>
          <main className="">
            <input
              id="nameInput"
              className="border-b-2 border-gray-400"
              name="name"
              value={author.name}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleBlur(e)}
            />
            <ErrorMessageComponent
              message={errorMessage.name}
              showErrorMessage={errorMessage.isNameErrorMessage}
              key={1}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Born:</aside>
          <main className="">
            <input
              id="bornInput"
              className="border-b-2 border-gray-400"
              name="born"
              value={author.born}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleBlur(e)}
            />
            <ErrorMessageComponent
              message={errorMessage.born}
              showErrorMessage={errorMessage.isBornErrorMessage}
              key={2}
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
            className={`border-2 border-black bg-red-500 p-2 rounded-md transition ease-linear duration-300 ${
              errorMessage.isNameErrorMessage ? "scale-125" : "scale-100"
            }`}
            type="button"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="border-2 border-black bg-green-500 p-2 rounded-md transition ease-linear duration-300 hover:scale-110 disabled:opacity-50"
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
