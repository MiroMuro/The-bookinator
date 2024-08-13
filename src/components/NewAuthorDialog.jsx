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
    <dialog className=".testDialog" ref={dialogRef}>
      <div>Hello World</div>
      <button type="button" onClick={() => setDialogOpen(false)}>
        Close
      </button>
    </dialog>
  );
};
export default NewAuthorDialog;
