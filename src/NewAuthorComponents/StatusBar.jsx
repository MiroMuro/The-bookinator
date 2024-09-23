import { useState, useEffect } from "react";
import PropTypes from "prop-types";
const StatusBar = ({ addAuthorMutationInfo }) => {
  const [statusBarInfo, setstatusBarInfo] = useState({
    status: addAuthorMutationInfo.status,
    message: addAuthorMutationInfo.message,
  });

  useEffect(() => {
    if (
      statusBarInfo.status === "success" ||
      statusBarInfo.status === "error"
    ) {
      const timer = setTimeout(() => {
        setstatusBarInfo({
          status: "",
          message: "",
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [statusBarInfo.status]);

  useEffect(() => {
    setstatusBarInfo({
      status: addAuthorMutationInfo.status,
      message: addAuthorMutationInfo.message,
    });
  }, [addAuthorMutationInfo]);

  //status = "success";
  if (statusBarInfo.status === "") {
    return <div></div>;
  }
  if (statusBarInfo.status === "loading") {
    return (
      <div className="mb-2 flex rounded border-2 border-gray-400 bg-yellow-200 p-2 text-center">
        <p>Status: Loading...</p>
        <span className="loader"></span>
      </div>
    );
  }
  if (statusBarInfo.status === "success") {
    return (
      <div
        data-test="successStatusBar"
        className=" mb-2 rounded border-2 border-gray-400 bg-green-400 p-2 text-center"
      >
        <p>Status: Success! {statusBarInfo.message}</p>
      </div>
    );
  }
  if (statusBarInfo.status === "error") {
    return (
      <div className="mb-2 rounded border-2 border-gray-400 bg-red-400 p-2 text-center">
        <p>Status: Error! {statusBarInfo.message}</p>
      </div>
    );
  }
};
StatusBar.propTypes = {
  addAuthorMutationInfo: PropTypes.shape({
    status: PropTypes.string.isRequired,
    message: PropTypes.string,
  }).isRequired,
};
export default StatusBar;
