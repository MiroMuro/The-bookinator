import { REGISTER } from "./queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
const RegisterForm = () => {
  const [error, setError] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    username: "",
    password: "",
    favoriteGenre: "",
  });

  const [registration, result] = useMutation(REGISTER, {
    onError: (error) => {
      setError(
        error.graphQLErrors[0].message,
        "code: ",
        error.graphQLErrors[0].extensions.code
      );
    },
    onCompleted: () => {
      setError("Registration successful, account created.");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        <div className=" justify-center items-start ">
          <h2 className="py-2 text-center bg-red-200 bg rounded mb-2">
            REGISTER
          </h2>{" "}
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
