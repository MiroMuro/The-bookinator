import { useState, useEffect } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "../components/queries";
import { useNavigate } from "react-router-dom";
const useLogin = (setToken) => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [message, setMessage] = useState({
    text: "Welcome back",
    style: "py-2 text-center bg-red-200 rounded mb-2",
  });
  //Flag for info animation.
  const [isAnimating, setIsAnimating] = useState(false);
  //Flag for loading spinner.
  const [isProcessing, setIsProcessing] = useState(false);

  //Function to trigger the info animation.
  const triggerAnimation = (status) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (!status) {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const [login, result] = useMutation(LOGIN, {
    //Handle the errors from the login mutation for different scenarios.
    onError: (error) => {
      if (error.networkError.code === "NETWORK_ERROR") {
        triggerAnimation(false);
        setMessage({
          text: error.networkError.message,
          style: "bg-red-500 py-2 text-center rounded mb-2",
        });
      } else if (error.networkError.code === "WRONG_CREDENTIALS") {
        console.log({ error });
        triggerAnimation(false);
        setMessage({
          text: error.networkError.message,
          style: "bg-red-500 py-2 text-center rounded mb-2",
        });
      } else {
        setMessage({
          text: "An error occurred. Please try again later.",
          style: "bg-red-500 py-2 text-center rounded mb-2",
        });
      }
    },
    onCompleted: () => {
      //Reset the loading spinner and trigger the info animation.
      triggerAnimation(true);
      setMessage({
        text: "Login successful! Redirecting...",
        style: "bg-green-500 py-2 text-center rounded mb-2",
      });
    },
  });

  //Stay alert for the login mutation to complete.
  //If successful, set the token and store it in the local storage.
  //Timer is set to 1 second to allow the info animation to play.
  useEffect(() => {
    if (result.data) {
      setTimeout(() => {
        const token = result.data.login.value;
        setToken(token);
        localStorage.setItem("library-user-token", token);
        navigate(0);
      }, 1000);
    }
  }, [result.data, setToken, navigate]);

  const handleLogin = (credentials) => {
    //Call the login mutation with the credentials.
    //Reset the loading spinner and trigger the info animation.
    setIsProcessing(true);
    login({ variables: credentials });
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setIsProcessing(false);
    setMessage({
      text: "Welcome back",
      style: "py-2 text-center bg-red-200 rounded mb-2",
    });
  };

  return {
    message,
    isAnimating,
    isProcessing,
    handleLogin,
    logout,
  };
};

export default useLogin;
