import { REGISTER } from "./queries";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const RegisterForm = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({
    text: "Register here!",
    style: "py-2 text-center bg-red-200 bg rounded mb-2",
  });

  const [accountDetails, setAccountDetails] = useState({
    username: "",
    password: "",
    favoriteGenre: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleError = (error) => {
    const { code, extensions, message } = error.networkError;

    if (code === "DUPLICATE_USERNAME") {
      setMessage({
        text: extensions.message,
        style: `bg-red-500 py-2 text-center bg rounded mb-2 `,
      });
    } else if (code === "NETWORK_ERROR") {
      setMessage({
        text: message,
        style: `bg-red-500 py-2 text-center bg rounded mb-2 `,
      });
    }
    setTimeout(() => {
      setMessage({
        text: "Register here!",
        style: "py-2 text-center bg-red-200 bg rounded mb-2",
      });
    }, 10000);
  };
  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset the state after 1 second
  };

  //Handle the registration mutation.
  const [registration, result] = useMutation(REGISTER, {
    onError: (error) => {
      setTimeout(() => {
        triggerAnimation();
        handleError(error);
        setIsProcessing(false);
      }, 1000);
    },
    onCompleted: () => {
      setIsProcessing(false);
      triggerAnimation();
      setMessage({
        text: "Registration successful! Redirecting to login...",
        style: `bg-green-500 py-2 text-center bg rounded mb-2 `,
      });
    },
  });

  useEffect(() => {
    //If result is succesful, set the token and save it to local storage
    //Wait for 1 second before redirecting, for an cool animation to play.
    if (result.data) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [result.data, navigate]);

  const usernameIsInvalid = (username) => {
    const invalidInputRegex = /^\s*$|^.{0,2}$|^.{31,}$/;
    return invalidInputRegex.test(username);
  };

  const passwordIsInvalid = (password) => {
    const invalidInputRegex = /^\s*$|^.{0,7}$|^.{101,}$/;
    return invalidInputRegex.test(password);
  };

  const favoriteGenreIsInvalid = (favoriteGenre) => {
    const invalidInputRegex = /^\s*$|^.{0,2}$|^.{31,}$/;
    return invalidInputRegex.test(favoriteGenre);
  };

  //Handle the input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRepeatPassword = (event) => {
    setRepeatPassword(event.target.value);
  };
  //Handle the registration form submission
  const handleRegistration = async (event) => {
    setIsProcessing(true);

    event.preventDefault();
    registration({
      variables: {
        username: accountDetails.username,
        password: accountDetails.password,
        favoriteGenre: accountDetails.favoriteGenre,
      },
    });
  };
  const RegisterButton = () => {
    let isDisabled;
    if (
      accountDetails.username.length < 3 ||
      accountDetails.password.length < 8 ||
      repeatPassword !== accountDetails.password ||
      accountDetails.favoriteGenre.length < 3
    ) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
    return (
      <div className="flex justify-center">
        <button
          data-test="register-button"
          type="submit"
          className="registerButton"
          disabled={isDisabled}
          title={isDisabled ? "Please fill in all fields." : "Register"}
        >
          Register
        </button>
      </div>
    );
  };
  const InfoBox = ({ isAnimating, isProcessing, message }) => {
    return (
      <div
        data-test="register-info-box"
        className={`${message.style} ${
          isAnimating ? "animate-scaleUpAndDown" : ""
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg
              className="mx-4 size-6 animate-spin fill-red-600 text-red-400"
              viewBox="0 0 101 101"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <h2 className={`${message.style}`}>{message.text}</h2>
        )}
      </div>
    );
  };
  InfoBox.propTypes = {
    isAnimating: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    message: PropTypes.object.isRequired,
  };
  return (
    <div className=" mx-auto flex w-10/12 flex-col justify-end align-middle md:mx-auto md:w-10/12 lg:w-10/12 lg:mx-auto sm:w-full ">
      <div className="flex mx-auto flex-col w-80 justify-end pb-3 mb-2 md:mx-0">
        {}
        <InfoBox
          isAnimating={isAnimating}
          isProcessing={isProcessing}
          message={message}
        />
        <form
          data-test="register-form"
          className="rounded-md border-2 border-black"
          onSubmit={handleRegistration}
        >
          <div data-test="username-div" className="m-2.5">
            Username
            <div
              data-test="username-error"
              className={`text-red-600 transition duration-500 ease-linear  ${
                usernameIsInvalid(accountDetails.username)
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              Username invalid!
            </div>
            <div>
              <input
                className="border-b-2 border-solid border-b-black w-full"
                value={accountDetails.username}
                name="username"
                onChange={handleChange}
              />
            </div>
          </div>
          <div data-test="password-div" className="m-2.5">
            Password
            <div>
              <div
                data-test="password-error"
                title="Password must be between 8-100 characters, and cannot be empty or contain only spaces."
                className={`text-red-600 transition duration-500 ease-linear  ${
                  passwordIsInvalid(accountDetails.password)
                    ? "opacity-100"
                    : "opacity-0"
                } `}
              >
                Password invalid!
              </div>
              <input
                className="border-b-2 border-solid border-b-black w-full"
                value={accountDetails.password}
                name="password"
                type="password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div data-test="repeat-password-div" className="m-2.5">
            Repeat password
            <div>
              <div
                data-test="repeat-password-error"
                title="Password must be between 8-100 characters, and cannot be empty or contain only spaces."
                className={` text-red-600 transition duration-500  ease-linear  ${
                  accountDetails.password !== repeatPassword
                    ? "opacity-100"
                    : "opacity-0"
                } `}
              >
                Passwords do not match!
              </div>
              <input
                className="border-b-2 border-solid border-b-black w-full"
                value={repeatPassword}
                name="repeatPassword"
                type="password"
                onChange={handleRepeatPassword}
              />
            </div>
          </div>
          <div data-test="favorite-genre-div" className="m-2.5">
            Favorite genre
            <div>
              <div
                data-test="favorite-genre-error"
                title="Genre must be between 2-30 characters,cannot be empty or contain only spaces."
                className={` text-red-600 transition duration-500 ease-linear ${
                  favoriteGenreIsInvalid(accountDetails.favoriteGenre)
                    ? "opacity-100"
                    : " opacity-0"
                } `}
              >
                Genre invalid!
              </div>
              <input
                className="border-b-2 border-solid border-b-black w-full"
                name="favoriteGenre"
                value={accountDetails.favoriteGenre}
                onChange={handleChange}
              />
            </div>
          </div>
          <RegisterButton />
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
