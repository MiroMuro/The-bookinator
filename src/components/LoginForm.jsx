import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "./queries";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = ({ setToken, token }) => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [message, setMessage] = useState({
    text: "Welcome back",
    style: "border-2 border-black py-2 text-center bg-red-200 ",
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset the state after 1 second
  };

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(
        error.graphQLErrors[0].message +
          "code: " +
          error.graphQLErrors[0].extensions.code
      );
      triggerAnimation();
      setMessage({
        text: "Login failed!",
      });
    },
    onCompleted: () => {
      setMessage("Login successful! Redirecting...");
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
      {/* <div style={{ color: "red" }}>{error}</div> */}
      {token && (
        <div>
          <h2>Already logged in</h2>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
      {!token && (
        <div className="flex flex-col justify-end basis-28 border-black border-2">
          <div
            className={`bg-red-200 py-2 text-center bg rounded ${
              isAnimating ? "animate-scaleUpAndDown bg-red-500" : ""
            }`}
          >
            {message.text}
          </div>
          <form
            onSubmit={handleLogin}
            className="border-black border-2 border rounded-md"
          >
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
              className="rounded-lg border-solid border-2 border-black m-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110"
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
