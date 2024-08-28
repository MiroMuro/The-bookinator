import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import PropTypes from "prop-types";

const TimeOutDialog = ({ open, onClose, errorMessage, setToken }) => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  const handleLoginButtonClick = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/login", { state: { logout: true } });
  };
  const handleContinueAsQuestButtonClick = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/");
    onClose();
  };
  return (
    <dialog
      ref={dialogRef}
      className=" relative animate-timedOutDialogPopUp rounded-md border-2 border-red-400 p-2"
    >
      <h2 className="rounded-md bg-red-500 text-center text-lg">ERROR!</h2>
      <p className="py-2">{errorMessage}</p>
      <div className=" flex flex-col items-center">
        <button
          className="my-2 w-1/2 scale-100 rounded-lg border-2 border-solid border-black p-1 text-center transition duration-500 ease-linear hover:scale-110 hover:border-transparent hover:bg-black hover:text-white"
          onClick={handleLoginButtonClick}
        >
          Login
        </button>
        <button
          className="my-2 w-1/2 scale-100 rounded-lg border-2 border-solid border-black p-1 text-center transition duration-500 ease-linear hover:scale-110 hover:border-transparent hover:bg-black hover:text-white"
          onClick={handleContinueAsQuestButtonClick}
        >
          {" "}
          Continue as a quest
        </button>
      </div>
    </dialog>
  );
};
TimeOutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
};
export default TimeOutDialog;
