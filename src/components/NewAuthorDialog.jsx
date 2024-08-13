import { useEffect, useState, useRef } from "react";
import useAddAuthorForm from "../hooks/useAddAuthorForm";
import { useMutation } from "@apollo/client";
import { CREATE_AUTHOR } from "../components/queries";
const NewAuthorDialog = ({ open, setDialogOpen }) => {
  const dialogRef = useRef(null);
  const [author, handleManualSubmit, handleChange] = useAddAuthorForm();
  console.log("Author: ", author);
  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  /*const [addAuthor] = useMutation(CREATE_AUTHOR, {
    onError: (error) => {
      console.log("***********ERROR IN ADDING AUTHOR**************", error);
    },
    onCompleted: (data) => {
      console.log("***********AUTHOR ADDED**************", data);
      return data.addAuthor;
    },
  });

  const handleManualSubmit = async () => {
    console.log("Adding author", author);
    const addedAuthorData = await addAuthor({
      variables: {
        name: author.name,
        born: parseInt(author.born),
        description: author.description,
      },
    });
    console.log(addedAuthorData);
  };*/

  return (
    <dialog className="newAuthorDialog" ref={dialogRef}>
      <form id="addAuthorForm">
        <header className="text-xl p-2 border-b-2 border-gray-400">
          Add a new Author
        </header>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Name:</aside>
          <main className=" shadow-xl border-b-2 border-gray-400">
            <input
              name="name"
              value={author.name}
              onChange={(e) => handleChange(e)}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
          <aside className="font-semibold">Born:</aside>
          <main className=" shadow-xl border-b-2 border-gray-400">
            <input
              name="born"
              value={author.born}
              onChange={(e) => handleChange(e)}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400 ">
          <aside className="font-semibold">Description:</aside>
          <main className=" shadow-xl border-b-2 border-gray-400">
            <textarea
              name="description"
              className="h-40"
              value={author.description}
              onChange={(e) => handleChange(e)}
            />
          </main>
        </section>
        <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400 ">
          <aside className="font-semibold">Image:</aside>
          <main className="">
            <input type="file" accept="image/*" />
          </main>
        </section>
        <section className="flex justify-between p-2 mb-4">
          <button
            className="border-2 border-black bg-red-500 p-2 rounded-md transition ease-linear duration-300 hover:scale-110"
            type="button"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="border-2 border-black bg-green-500 p-2 rounded-md transition ease-linear duration-300  hover:scale-110"
            type="button"
            id="addAuthorButton"
            onClick={handleManualSubmit}
          >
            Add author
          </button>
        </section>
      </form>
    </dialog>
  );
};
export default NewAuthorDialog;
