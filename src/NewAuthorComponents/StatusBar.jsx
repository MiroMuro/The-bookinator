import { useState, useEffect } from "react";
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
      <div className="flex p-2 bg-yellow-200 rounded mb-2 border-2 border-gray-400 text-center">
        <p>Status: Loading...</p>
        <span class="loader"></span>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className=" p-2 bg-green-400 rounded mb-2 border-2 border-gray-400 text-center">
        <p> Status: Success!</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center">
        Status: Error! Please try again.
      </div>
    );
  }
};
export default StatusBar;
