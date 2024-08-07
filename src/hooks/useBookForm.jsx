import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useForm from "./useForm";
import {
  CREATE_BOOK,
  ALL_AUTHORS,
  AUTHOR_UPDATED,
  UPLOAD_BOOK_IMAGE,
} from "../components/queries";
const useBookForm = (token, setToken) => {
  const [bookInfo, handleChange, reset, addGenre, handleGenreDeletion] =
    useForm({
      title: "",
      author: "",
      published: 0,
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

  // State for the processing animation.
  const [isProcessing, setIsProcessing] = useState(false);

  //State for the iamge file of the book.
  const [file, setFile] = useState(null);

  //State for the Authors dialog.
  const [authorsDialogOpen, setAuthorsDialogOpen] = useState(false);

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
    if (error.networkError) {
      const { code, result, extensions } = error.networkError;
      if (result && result.name === "TokenExpiredError") {
        setMessageBoxContent("You were timed out! Please log in again.");
        setDialogOpen(true);
      } else if (code === "DUPLICATE_BOOK_TITLE") {
        setMessage({
          text: "A book with the same title already exists!",
          style:
            "p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      } else if (code === "BAD_BOOK_GENRES") {
        setMessage({
          text: extensions.message,
          style:
            "p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      } else if (code === "NETWORK_ERROR") {
        setMessage({
          text:
            extensions?.message ||
            "A network error occurred. Please try again later.",
          style:
            " p-2 bg-red-400 rounded mb-2 border-2 border-gray-400 text-center",
        });
        resetMessage();
      }
    }
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
          text: `${data.addBook.title} by ${data.addBook.author.name} was added succesfully!`,
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
    setFile(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    //Add the book and wait for the response for information about the book.
    const addedBookData = await addBook({
      variables: {
        title: bookInfo.title,
        author: bookInfo.author,
        published: parseInt(bookInfo.published),
        genres: bookInfo.genres,
      },
    });
    console.log(addedBookData.data.addBook);
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
  };
};

export default useBookForm;
