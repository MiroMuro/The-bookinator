import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_AUTHOR } from "../components/queries";
const useAddAuthorForm = () => {
  const [author, setAuthor] = useState({
    name: "",
    born: "",
    description: "",
  });

  const handleChange = (event) => {
    let { name, value } = event.target;
    setAuthor((prev) => ({ ...prev, [name]: value }));
  };

  const [addAuthor] = useMutation(CREATE_AUTHOR, {
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
  };

  return [author, handleManualSubmit, handleChange];
};
export default useAddAuthorForm;
