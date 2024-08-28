import { useState, useEffect } from "react";
import PropTypes from "prop-types";
const StatusBar = ({ initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);

    if (initialStatus === "success" || initialStatus === "error") {
      const timer = setTimeout(() => {
        setStatus("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [initialStatus]);

  //initialStatus = "success";
  if (status === "") {
    return <div></div>;
  }
  if (status === "loading") {
    return (
      <div className="mb-2 flex rounded border-2 border-gray-400 bg-yellow-200 p-2 text-center">
        <p>Status: Loading...</p>
        <span className="loader"></span>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className=" mb-2 rounded border-2 border-gray-400 bg-green-400 p-2 text-center">
        <p> Status: Success!</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="mb-2 rounded border-2 border-gray-400 bg-red-400 p-2 text-center">
        Status: Error! Please try again.
      </div>
    );
  }
};
StatusBar.propTypes = {
  initialStatus: PropTypes.string.isRequired,
};
export default StatusBar;
