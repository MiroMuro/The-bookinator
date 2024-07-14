import { GET_USER } from "./queries";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
const Header = ({ token }) => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER);
  let greeting = useRef("Not logged in yet!");

  // eslint-disable-next-line no-restricted-globals
  addEventListener("storage", (event) => {
    console.log("Storage event", event);
  });

  useEffect(() => {
    if (!token) {
      greeting.current = "Not logged in";
    } else {
      greeting.current = `Welcome back!`;
    }
  }, [token]);

  return (
    <header className="flex justify-between sticky top-0 items-center border-2 border-gray-400 bg-red-200 p-3 z-10">
      <img src={require("./open-book.png")} alt="Bookinator logo"></img>
      <p>Welcome to the Bookinator!</p>
      <p>{greeting.current}</p>
    </header>
  );
};
export default Header;
