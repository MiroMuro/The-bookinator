import { REGISTER } from "./queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
const RegisterForm = () => {
  const [error, setError] = useState("");
  const [accountDetails, setAccounDetails] = useState({
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
    <div style={{ border: "2px solid black", width: "20%", borderRadius: 10 }}>
      <div style={{ color: "red" }}>{error}</div>
      <form onSubmit={handleRegistration}>
        <div style={{ margin: "10px" }}>
          Username
          <div>
            <input
              className="border-b-2 border-b-solid border-b-black"
              value={accountDetails.username}
              onChange={(event) =>
                setAccounDetails({
                  ...accountDetails,
                  username: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div style={{ margin: "10px" }}>
          Password
          <div>
            <input
              className="border-b-2 border-b-solid border-b-black"
              value={accountDetails.password}
              onChange={(event) =>
                setAccounDetails({
                  ...accountDetails,
                  password: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div style={{ margin: "10px" }}>
          Favorite genre
          <div>
            <input
              className="border-b-2 border-b-solid border-b-black"
              value={accountDetails.favoriteGenre}
              onChange={(event) =>
                setAccounDetails({
                  ...accountDetails,
                  favoriteGenre: event.target.value,
                })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg border-solid border-black border-2 m-2 p-1"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
