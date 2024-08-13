import { useEffect, useState, useRef } from "react";

const NewAuthorDialog = ({ open, setDialogOpen }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);
  return (
    <dialog className="newAuthorDialog" ref={dialogRef}>
      <header className="text-xl p-2 border-b-2 border-gray-400">
        Add a new Author
      </header>
      <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
        <aside className="font-semibold">Name:</aside>
        <main className=" shadow-xl border-b-2 border-gray-400">
          <input />
        </main>
      </section>
      <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400">
        <aside className="font-semibold">Born:</aside>
        <main className=" shadow-xl border-b-2 border-gray-400">
          <input />
        </main>
      </section>
      <section className="flex p-2 pb-8 justify-between border-b-2 border-gray-400 ">
        <aside className="font-semibold">Description:</aside>
        <main className=" shadow-xl border-b-2 border-gray-400">
          <textarea className="h-40" />
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
          onClick={() => setDialogOpen(false)}
        >
          Add author
        </button>
      </section>
    </dialog>
  );
};
export default NewAuthorDialog;
