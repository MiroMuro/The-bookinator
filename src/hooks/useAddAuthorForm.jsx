import { useState } from "react";

const useAddAuthorForm = () => {
  const [author, setAuthor] = useState({
    name: "",
    born: "",
    description: "",
  });
};
export default useAddAuthorForm;
