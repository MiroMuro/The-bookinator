import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_AUTHOR } from "../components/queries";
const useAddAuthorForm = () => {
  const [author, setAuthor] = useState({
    name: "",
    born: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    name: [],
    isNameErrorMessage: false,
    born: [],
    isBornErrorMessage: false,
    description: "",
    isDescriptionErrorMessage: false,
    isImageErrorMessage: false,
    image: "",
  });

  const handleChange = (event) => {
    let { name, value } = event.target;
    let errorMsg = "";
    const currentYear = new Date().getFullYear();

    if (name === "born" && value > currentYear) {
      if (
        errorMessage.born &&
        errorMessage.born.includes("Birth year cannot be in the future")
      ) {
        event.preventDefault();
        return;
      } else {
        errorMsg = "Birth year cannot be in the future";
        setErrorMessage((prev) => ({
          ...prev,
          born: [...prev.born, errorMsg],
          isBornErrorMessage: true,
        }));
        event.preventDefault();
      }
    } else {
      setAuthor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNameBeforeInput = (event) => {
    const { data, target } = event;
    let errorMsg = "";
    if (target.id === "nameInput" && /^\d+$/.test(data)) {
      if (
        errorMessage.name &&
        errorMessage.name.includes("Name cannot contain numbers.")
      ) {
        event.preventDefault();
      } else {
        errorMsg = "Name cannot contain numbers.";
        setErrorMessage((prev) => ({
          ...prev,
          name: [prev.name, errorMsg],
          isNameErrorMessage: true,
        }));
        event.preventDefault();
      }
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        name: "",
        isNameErrorMessage: false,
      }));
    }
  };

  const handleBornBeforeInput = (event) => {
    console.log("In handleBornBeforeInput. Event: ", event);
    const { data, target } = event;
    let errorMsg = "";
    //If the input is not a number, prevent the default action and play the animation.
    // Jos ei ole taulukossa ja on error
    // Jos on taulukossa ja on error
    // Jos ei ole taulukossa ja ei ole error

    //On error
    if (target.id === "bornInput" && !/^\d+$/.test(data)) {
      //on taulukossa ja on error
      if (
        errorMessage.born &&
        errorMessage.born.includes("Only numbers are allowed.")
      ) {
        event.preventDefault();
      } else {
        console.log("In handleBornBeforeInput. Error message: ", errorMessage);
        // ei ole taulukossa ja on error
        errorMsg = "Only numbers are allowed.";
        console.log("In handleBornBeforeInput. Error message: ", errorMessage);
        setErrorMessage((prev) => ({
          ...prev,
          born: [...prev.born, errorMsg],
          isBornErrorMessage: true,
        }));
        event.preventDefault();
      }
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        born: "",
        isBornErrorMessage: false,
      }));
    }
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
  //Submit doesn't work for the author form is actually nested in the book form.
  //So, we need to manually submit the author form.
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

  return [
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    setErrorMessage,
    handleBornBeforeInput,
    handleNameBeforeInput,
  ];
};
export default useAddAuthorForm;
