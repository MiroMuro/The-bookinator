import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_AUTHOR } from "../components/queries";
import { validate } from "graphql";
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

    setAuthor((prev) => ({ ...prev, [name]: value }));
  };

  const validateName = (name) => {
    let errors = [];

    if (name.length < 4) {
      errors.push("Name must be at least 4 characters long.");
    }

    if (/\d/.test(name)) {
      errors.push("Name should not contain numbers.");
    }

    setErrorMessage((prev) => ({
      ...prev,
      name: errors,
      isNameErrorMessage: errors.length > 0,
    }));
  };

  const validateBorn = (born) => {
    let errors = [];
    const currentYear = new Date().getFullYear();

    if (born === "") {
      // Clear errors if the field is empty
      errors = [];
    } else if (isNaN(born)) {
      errors.push("Born year should only contain numbers.");
    } else {
      const bornYear = parseInt(born);
      if (bornYear > currentYear) {
        errors.push("Born year cannot be in the future.");
      }
    }
    setErrorMessage((prev) => ({
      ...prev,
      born: errors,
      isBornErrorMessage: errors.length > 0,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      validateName(value);
    } else if (name === "born") {
      validateBorn(value);
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
    validateBorn,
    validateName,
    handleBlur,
  ];
};
export default useAddAuthorForm;
