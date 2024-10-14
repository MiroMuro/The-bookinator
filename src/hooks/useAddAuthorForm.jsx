import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_AUTHOR,
  ALL_AUTHORS,
  AUTHOR_ADDED,
  UPLOAD_AUTHOR_IMAGE,
} from "../components/queries";
const useAddAuthorForm = () => {
  const [author, setAuthor] = useState({
    name: "",
    born: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  //State for the file validation message;
  const [fileValidationMessage, setFileValidationMessage] = useState("");
  const [addAuthorMutationInfo, setaddAuthorMutationInfo] = useState({
    status: "",
    message: "",
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

  const ERROR_TYPES = {
    TOKEN_EXPIRED: "TokenExpiredError",
    BAD_AUTHOR_NAME: "BAD_AUTHOR_NAME",
    DUPLICATE_AUTHOR_NAME: "DUPLICATE_AUTHOR_NAME",
    BAD_AUTHOR_BORN: "BAD_AUTHOR_BIRTH_YEAR",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  };

  const resetAuthorInfo = () => {
    setAuthor({
      name: "",
      born: "",
      description: "",
    });
    setFile(null);
  };

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
        errors.push("Author cannot be born in the future.");
      }
      if (bornYear < 0) {
        errors.push("Author birth year cannot be negative.");
      }
    }
    setErrorMessage((prev) => ({
      ...prev,
      born: errors,
      isBornErrorMessage: errors.length > 0,
    }));
  };

  const isFormValid = () => {
    if (
      errorMessage.isNameErrorMessage ||
      errorMessage.isBornErrorMessage ||
      errorMessage.isImageErrorMessage
    ) {
      return true;
    } else if (
      !errorMessage.isNameErrorMessage &&
      !errorMessage.isBornErrorMessage &&
      !errorMessage.isImageErrorMessage
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
      handleError(error);
    },
    onCompleted: (data) => {
      console.log("***********AUTHOR ADDED**************", data);
      setaddAuthorMutationInfo({
        status: "success",
        message: "Author " + data.addAuthor.name + " added successfully!",
      });
      resetAuthorInfo();
      return data.addAuthor;
    },
  });

  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again later.";

    if (!error.networkError) {
      setaddAuthorMutationInfo({
        status: "error",
        message: errorMessage,
      });
      return;
    }

    const { code, result, extensions } = error.networkError;

    if (result?.name === ERROR_TYPES.TOKEN_EXPIRED) {
      errorMessage = "You were timed out! Please log in again.";
      setaddAuthorMutationInfo({
        status: "error",
        message: errorMessage,
      });
      return;
    }

    switch (code) {
      case ERROR_TYPES.BAD_AUTHOR_NAME:
        errorMessage = extensions.message;
        break;
      case ERROR_TYPES.DUPLICATE_AUTHOR_NAME:
        errorMessage = extensions.message;
        break;
      case ERROR_TYPES.BAD_AUTHOR_BORN:
        errorMessage = extensions.message;
        break;
      case ERROR_TYPES.INTERNAL_SERVER_ERROR:
        errorMessage =
          extensions?.message || "An error occurred. Please try again later.";
        break;
      default:
        errorMessage = "An error occurred. Please try again later.";
        return;
    }
    setaddAuthorMutationInfo({
      status: "error",
      message: errorMessage,
    });
  };

  const [uploadAuthorImage] = useMutation(UPLOAD_AUTHOR_IMAGE, {
    onError: (error) => {
      console.log("Error in uploading image", error);
    },
    onCompleted: (data) => {
      console.log("Image uploaded successfully. Data is", data);
    },
  });

  //Submit doesn't work for the author form is actually nested in the book form.
  //So, we need to manually submit the author form.
  const handleManualSubmit = async () => {
    setaddAuthorMutationInfo({
      status: "loading",
      message: "Adding author...",
    });
    validateBorn(author.born);
    validateName(author.name);
    if (isFormValid()) {
      console.log("Form is not valid");
      return;
    }
    const addedAuthorData = await addAuthor({
      variables: {
        name: author.name,
        born: parseInt(author.born),
        description: author.description,
      },
    });
    console.log(addedAuthorData);
    //Attempt to upload the image if the author was added successfully.
    try {
      const authorId = addedAuthorData.data.addAuthor.id;
      const { data } = await uploadAuthorImage({
        variables: { file, authorId },
      });
      console.log("The data is", data);
    } catch (error) {
      console.log("Error in adding author", error);
    }
  };

  const validateFile = (file) => {
    let errorMessage = "";
    //Check if the file is an image and if it is not too large. (10 megabytes in binary)
    const allowedExtensions = [".jpg", ".jpeg", ".png"],
      sizeLimit = 1000000;
    const { name, size } = file;
    const fileExtensions = name.slice(name.lastIndexOf("."));

    if (size > sizeLimit) {
      console.log("File size is too large");
      errorMessage = "The file is too large.";
      setErrorMessage((prev) => ({
        ...prev,
        image: errorMessage,
        isImageErrorMessage: true,
      }));
      return errorMessage;
    }
    if (
      fileExtensions !== allowedExtensions[0] &&
      fileExtensions !== allowedExtensions[1] &&
      fileExtensions !== allowedExtensions[2]
    ) {
      errorMessage = "The file is not an image.";
      setErrorMessage((prev) => ({
        ...prev,
        image: errorMessage,
        isImageErrorMessage: true,
      }));
      return errorMessage;
    }
    setErrorMessage((prev) => ({
      ...prev,
      image: "",
      isImageErrorMessage: false,
    }));
    return (errorMessage = "File validated successfully!");
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Author Image file", file);
    const validationMessage = validateFile(file);
    if (validationMessage !== "File validated successfully!") {
      setFileValidationMessage(validationMessage);
      return;
    } else {
      setFileValidationMessage(validationMessage);
      setFile(file);
      return;
    }
  };
  return {
    author,
    handleManualSubmit,
    handleChange,
    errorMessage,
    handleBlur,
    addAuthorMutationInfo,
    handleFileChange,
    fileValidationMessage,
    isFormValid,
  };
};
export default useAddAuthorForm;
