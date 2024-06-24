import { useRef, useEffect } from "react";

const TimeOutDialog = ({ open, onClose, onRetry }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);
  return (
    <dialog ref={dialogRef} className="custom-dialog">
      <h2>Error</h2>
      <p>An error has occured.</p>
      <div>
        <button onClick={onRetry}>Retry</button>
        <button onClick={onClose}>Close</button>
      </div>
    </dialog>
  );
};

export default TimeOutDialog;
