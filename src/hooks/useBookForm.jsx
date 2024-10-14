import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useForm from "./useForm";
import {
  CREATE_BOOK,
  ALL_AUTHORS,
  AUTHOR_UPDATED,
  UPLOAD_BOOK_IMAGE,
} from "../components/queries";
const useBookForm = (token) => {
  const [
    bookInfo,
    handleChange,
    reset,
    addGenre,
    handleGenreDeletion,
    setAuthor,
  ] = useForm({
    title: "",
    author: "",
    published: 0,
    description: "",
    genre: "",
    genres: [],
  });
  // State for the error message and error animation
  // when the user tries to add a book with an invalid birthyear.
  const [playPubYearErrorAnimation, setPlayPubYearErrorAnimation] =
    useState(false);
  // State for the animation of the message box.
  const [pubYearErrorMessage, setPubYearErrorMessage] = useState("");

  // State for the animation of the message box.
  const [isAnimating, setIsAnimating] = useState(false);

  // State for the message box and its style.
  const [message, setMessage] = useState({
    text: "Add a new book!",
    style: "py-2 bg-red-200 rounded mb-2 border-2 border-gray-400 text-center",
  });

  //This updated the apollo cache after a book is added.
  const { subscribeToMore } = useQuery(ALL_AUTHORS, {
    fetchPolicy: "cache-and-network",
  });

  // Open or close state for the dialog box.
  const [dialogOpen, setDialogOpen] = useState(false);

  // State for the dialog box content.
  const [messageBoxContent, setMessageBoxContent] = useState("");

  // State for the duplicate genre error message.
  const [isDuplicateGenre, setIsDuplicateGenre] = useState(false);

  // State for too long genre name.
  const [isTooLongGenre, setIsTooLongGenre] = useState(false);

  // State for the processing animation.
  const [isProcessing, setIsProcessing] = useState(false);

  //State for the iamge file of the book.
  const [file, setFile] = useState(null);

  //State for the file validation message;
  const [fileValidationMessage, setFileValidationMessage] = useState("");

  //State for the Authors dialog.
  const [authorsDialogOpen, setAuthorsDialogOpen] = useState(false);

  //State for the "Add a new author" dialog.
  const [addAuthorDialogOpen, setAddAuthorDialogOpen] = useState(false);

  const ERROR_TYPES = {
    TOKEN_EXPIRED: "TokenExpiredError",
    DUPLICATE_BOOK: "DUPLICATE_BOOK_TITLE",
    BAD_BOOK_GENRES: "BAD_BOOK_GENRES",
    NETWORK_ERROR: "NETWORK_ERROR",
    BAD_TITLE: "BAD_BOOK_TITLE",
  };

  const [uploadBookImage] = useMutation(UPLOAD_BOOK_IMAGE, {
    onError: (error) => {
      console.log("Error in uploading image");
      console.log(error);
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const resetMessage = () => {
    setTimeout(() => {
      setMessage({
        text: "Add a new book!",
        style:
          "p-2 bg-red-200 rounded mb-2 border-2 border-gray-400 text-center",
      });
    }, 5000);
  };

  const triggerAnimation = (status) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (!status) {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const handleError = (error) => {
    //Error handling for bad user inputs, network errors and token expiration.

    if (!error.networkError) return;

    const { code, result, extensions } = error.networkError;

    if (result?.name === ERROR_TYPES.TOKEN_EXPIRED) {
      setMessageBoxContent("You were timed out! Please log in again.");
      setDialogOpen(true);
    }

    const messageBoxErrorStyle =
      "p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center";
    let messageText;

    switch (code) {
      case ERROR_TYPES.DUPLICATE_BOOK:
        messageText = extensions.message;
        break;
      case ERROR_TYPES.BAD_BOOK_GENRES:
        messageText = extensions.message;
        break;
      case ERROR_TYPES.BAD_TITLE:
        messageText = extensions.message;
        break;
      case ERROR_TYPES.NETWORK_ERROR:
        messageText =
          extensions?.message ||
          "A network error occurred. Please try again later.";
        break;
      default:
        messageText = "An error occurred. Please try again later.";
        return;
    }
    setMessage({ text: messageText, style: messageBoxErrorStyle });
    resetMessage();
  };

  //Mutation to add a new book
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      setTimeout(() => {
        triggerAnimation(false);
        handleError(error);
      }, 1000);
    },
    onCompleted: (data) => {
      resetMessage();
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      setTimeout(() => {
        triggerAnimation(true);
        setMessage({
          text: `${data.addBook.title} by ${data.addBook.author.name} was added successfully!`,
          style:
            " p-2 bg-green-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
      }, 1000);
      resetMessage();
      return data.addBook;
    },

    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (!token) {
      setDialogOpen(true);
      setMessageBoxContent(
        "Please log in to add a book. Or continue as a guest."
      );
    }
    const unsubscribe = subscribeToMore({
      //This is the subscription query
      document: AUTHOR_UPDATED,
      // The return values replaces the cache with the updated author.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedAuthor = subscriptionData.data.authorUpdated;

        return {
          allAuthors: prev.allAuthors.map((author) =>
            author.name === updatedAuthor.name ? updatedAuthor : author
          ),
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, token]);

  const handleBeforeInput = (event) => {
    const currentYear = new Date().getFullYear();
    const { data } = event;
    //If the input is not a number, prevent the default action and play the animation.
    if (!/^\d+$/.test(data)) {
      setPlayPubYearErrorAnimation(true);
      setPubYearErrorMessage("Only numbers are allowed.");
      event.preventDefault();
    } else if (currentYear < parseInt(data)) {
      setPlayPubYearErrorAnimation(true);
      setPubYearErrorMessage("The year cannot be in the future.");
    } else if (data < 0) {
      setPlayPubYearErrorAnimation(true);
      setPubYearErrorMessage("The year cannot be negative.");
    } else {
      setPlayPubYearErrorAnimation(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validationMessage = validateFile(file);
    if (validationMessage !== "File validated successfully!") {
      console.log(validationMessage);
      setFileValidationMessage(validationMessage);
      return;
    } else {
      console.log("File validated successfully!");
      setFileValidationMessage(validationMessage);
      setFile(file);
    }
  };

  const validateFile = (file) => {
    let errorMessage = "";
    //Check if the file is an image and if it is not too large. (10 megabytes in binary)
    const allowedExtensions = [".jpg", ".jpeg", ".png"],
      sizeLimit = 1000000;

    const { name, fileSize } = file;
    const fileExtensions = name.slice(name.lastIndexOf("."));

    if (fileSize > sizeLimit) {
      errorMessage = "The file is too large.";
      return errorMessage;
    }
    if (
      fileExtensions !== allowedExtensions[0] &&
      fileExtensions !== allowedExtensions[1] &&
      fileExtensions !== allowedExtensions[2]
    ) {
      errorMessage = "The file is not an image.";
      return errorMessage;
    }
    return (errorMessage = "File validated successfully!");
  };

  const submit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    //Add the book and wait for the response for information about the book.
    const addedBookData = await addBook({
      variables: {
        title: bookInfo.title,
        author: bookInfo.author,
        published: parseInt(bookInfo.published),
        description: bookInfo.description,
        genres: bookInfo.genres,
      },
    });
    //Try to upload the image after the book has been added.
    try {
      const bookId = addedBookData.data.addBook.id;
      const { data } = await uploadBookImage({
        variables: { file, bookId },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    bookInfo,
    playPubYearErrorAnimation,
    setPlayPubYearErrorAnimation,
    pubYearErrorMessage,
    setPubYearErrorMessage,
    isAnimating,
    message,
    dialogOpen,
    setDialogOpen,
    messageBoxContent,
    isDuplicateGenre,
    setIsDuplicateGenre,
    isProcessing,
    setIsProcessing,
    file,
    setFile,
    authorsDialogOpen,
    setAuthorsDialogOpen,
    handleBeforeInput,
    handleFileChange,
    submit,
    handleChange,
    reset,
    addGenre,
    handleGenreDeletion,
    setAuthor,
    addAuthorDialogOpen,
    setAddAuthorDialogOpen,
    isTooLongGenre,
    setIsTooLongGenre,
    fileValidationMessage,
    setFileValidationMessage,
  };
};

export default useBookForm;
