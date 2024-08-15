import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_AUTHOR,
  ALL_AUTHORS,
  AUTHOR_ADDED,
} from "../components/queries";
const useAddAuthorForm = () => {
  const [author, setAuthor] = useState({
    name: "",
    born: "",
    description: "",
  });
  const [addAuthorStatus, setAddAuthorStatus] = useState(""); // This is the status of the add author mutation.
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

  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: AUTHOR_ADDED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newAuthor = subscriptionData.data.authorAdded;

        return {
          allAuthors: prev.allAuthors.map((author) =>
            author.name === newAuthor.name ? newAuthor : author
          ),
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

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

  const isFormValid = () => {
    if (errorMessage.isNameErrorMessage || errorMessage.isBornErrorMessage) {
      return true;
    } else if (
      !errorMessage.isNameErrorMessage &&
      !errorMessage.isBornErrorMessage
    ) {
      return false;
    }
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
      setAddAuthorStatus("error");
    },
    onCompleted: (data) => {
      console.log("***********AUTHOR ADDED**************", data);
      setAddAuthorStatus("success");
      setAuthor({
        name: "",
        born: "",
        description: "",
      });
      return data.addAuthor;
    },
  });
  //Submit doesn't work for the author form is actually nested in the book form.
  //So, we need to manually submit the author form.
  const handleManualSubmit = async () => {
    setAddAuthorStatus("loading");
    validateBorn(author.born);
    validateName(author.name);
    if (isFormValid()) {
      console.log("Form is not valid");
      return;
    }
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

  return {
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    handleBlur,
    addAuthorStatus,
  };
};
export default useAddAuthorForm;
