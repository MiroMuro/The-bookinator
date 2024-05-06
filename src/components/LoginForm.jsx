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
    <div>
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
        <div
          style={{ border: "2px solid black", width: "20%", borderRadius: 10 }}
        >
          <form onSubmit={handleLogin}>
            <div style={{ margin: "10px" }}>
              Username:
              <input
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
                value={credientals.password}
                onChange={(event) =>
                  setCredientals({
                    ...credientals,
                    password: event.target.value,
                  })
                }
              />
            </div>
            <button type="submit" style={{ margin: "10px" }}>
              Log in
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
