import { REGISTER } from "./queries";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

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

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset the state after 1 second
  };

  //Handle the registration mutation.
  const [registration, result] = useMutation(REGISTER, {
    onError: (error) => {
      console.log(
        error.graphQLErrors[0].message +
          "code: " +
          error.graphQLErrors[0].extensions.code +
          "error: " +
          error.graphQLErrors[0].extensions.invalidArgs
      );
      triggerAnimation();
      setMessage({
        text: "Registration failed! " + error.graphQLErrors[0].extensions.code,
        style: `bg-red-500 py-2 text-center bg rounded mb-2 `,
      });
    },
    onCompleted: () => {
      triggerAnimation();

      setMessage({
        text: "Registration successful! Redirecting...",
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
      accountDetails.username === "" ||
      accountDetails.password === "" ||
      repeatPassword === "" ||
      accountDetails.favoriteGenre === ""
    ) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
    return (
      <button
        type="submit"
        className="registerButton"
        disabled={isDisabled}
        title={isDisabled ? "Please fill in all fields." : "Register"}
      >
        Register
      </button>
    );
  };
  return (
    <div className="flex">
      <div className="flex flex-col justify-end basis-28">
        <div
          className={` ${message.style} ${
            isAnimating ? "animate-scaleUpAndDown" : ""
          }`}
        >
          <h2 className={`${message.style}`}>{message.text}</h2>{" "}
        </div>

        <form
          className="border-black border-2 rounded-md"
          onSubmit={handleRegistration}
        >
          <div className="m-2.5">
            Username
            <div
              className={` ${
                usernameIsInvalid(accountDetails.username)
                  ? "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-100"
                  : "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-0"
              } `}
            >
              Username invalid!
            </div>
            <div>
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={accountDetails.username}
                name="username"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="m-2.5">
            Password
            <div>
              <div
                title="Password must be between 8-100 characters, and cannot be empty or contain only spaces."
                className={` ${
                  passwordIsInvalid(accountDetails.password)
                    ? "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-100"
                    : "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-0"
                } `}
              >
                Password invalid!
              </div>
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={accountDetails.password}
                name="password"
                type="password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="m-2.5">
            Repeat password
            <div>
              <div
                title="Password must be between 8-100 characters, and cannot be empty or contain only spaces."
                className={` ${
                  accountDetails.password !== repeatPassword
                    ? "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-100"
                    : "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-0"
                } `}
              >
                Passwords dont match!
              </div>
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={repeatPassword}
                name="repeatPassword"
                type="password"
                onChange={handleRepeatPassword}
              />
            </div>
          </div>
          <div className="m-2.5">
            Favorite genre
            <div>
              <div
                title="Genre must be between 2-30 characters,cannot be empty or contain only spaces."
                className={` ${
                  favoriteGenreIsInvalid(accountDetails.favoriteGenre)
                    ? "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-100"
                    : "text-red-600 duration-500 transition ease-linear duration 300 transform opacity-0"
                } `}
              >
                Genre invalid!
              </div>
              <input
                className="border-b-2 border-b-solid border-b-black"
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
