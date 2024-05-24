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
        text: "Login successful! Redirecting...",
        style: `bg-green-500 py-2 text-center bg rounded mb-2 `,
      });
    },
  });

  useEffect(() => {
    //If result is succesful, set the token and save it to local storage
    //Wait for 1 second before redirecting, for an cool animation to play.
    if (result.data) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [result.data, navigate]);

  //Handle the input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={accountDetails.password}
                name="password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="m-2.5">
            Favorite genre
            <div>
              <input
                className="border-b-2 border-b-solid border-b-black"
                name="favoriteGenre"
                value={accountDetails.favoriteGenre}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg border-solid border-2 border-black m-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
