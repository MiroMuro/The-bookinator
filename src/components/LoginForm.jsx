import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "./queries";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = ({ setToken, token }) => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(
        error.graphQLErrors[0].message +
          "code: " +
          error.graphQLErrors[0].extensions.code
      );
    },
    onCompleted: () => {
      setError("Login successful");
    },
  });

  const [credientals, setCredientals] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]);

  const handleLogin = async (event) => {
    event.preventDefault();
    login({
      variables: {
        username: credientals.username,
        password: credientals.password,
      },
    });
    console.log("Loggin in...");
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/");
  };

  if (location.state) {
    logout();
  }
  return (
    <div className="flex">
      <div style={{ color: "red" }}>{error}</div>
      {token && (
        <div>
          <h2>Already logged in</h2>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
      {!token && (
        <div className="flex basis-28 justify-center border-2  border-neutral-950 border-radius-2">
          <form onSubmit={handleLogin}>
            <div style={{ margin: "10px" }}>
              Username:
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={credientals.username}
                onChange={(event) =>
                  setCredientals({
                    ...credientals,
                    username: event.target.value,
                  })
                }
              />
            </div>
            <div style={{ margin: "10px" }}>
              Password:
              <input
                className="border-b-2 border-b-solid border-b-black"
                value={credientals.password}
                onChange={(event) =>
                  setCredientals({
                    ...credientals,
                    password: event.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border-solid border-2 border-black m-2 p-1"
            >
              Log in
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
