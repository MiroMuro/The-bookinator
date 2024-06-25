import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "./queries";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm = ({ setToken, token }) => {
  const client = useApolloClient();
  const navigate = useNavigate();
  //Get the address of the page the user was redirected from.
  const loc = useLocation();
  const [message, setMessage] = useState({
    text: "Welcome back",
    style: " py-2 text-center bg-red-200 bg rounded mb-2",
  });

  //Flag to check if the animation is playing.
  const [isAnimating, setIsAnimating] = useState(false);

  const [credientals, setCredientals] = useState({
    username: "",
    password: "",
  });

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset the state after 1 second
  };

  const [login, result] = useMutation(LOGIN, {
    //Here we play the animation and set the message based on the result of the mutation
    onError: (error) => {
      console.log(
        error.graphQLErrors[0].message +
          "code: " +
          error.graphQLErrors[0].extensions.code
      );
      triggerAnimation();
      setMessage({
        text: "Login failed!",
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
        const token = result.data.login.value;
        setToken(token);
        localStorage.setItem("library-user-token", token);
      }, 1000);
    }
    if (loc.state && loc.state.logout) {
      logout();
    }
  }, [result.data, setToken, loc.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredientals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    login({
      variables: { ...credientals },
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setMessage({
      text: "Welcome back",
      style: " py-2 text-center bg-red-200 bg rounded mb-2",
    });
  };

  return (
    <div className="flex">
      {/*If user is logged in display this*/}
      {token && (
        <div className="flex flex-col justify-end items-start ">
          <div className="border-black border-2  p-4 rounded-md">
            <h2 className="p-2 text-center bg-red-200 bg rounded mb-2">
              Already logged in
            </h2>
            <div className="rounded-lg w-1/2 border-solid border-2 text-center border-black my-2 p-1 hover:bg-black hover:text-white hover:border-transparent transition ease-linear duration-500 scale-100 transform hover:scale-110">
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      )}
      {/*If user isn't logged in display login form*/}
      {!token && (
        <div className="flex flex-col justify-end basis-28">
          {/*Animation is in tailwind.config.js*/}
          <div
            className={` ${message.style} ${
              isAnimating ? "animate-scaleUpAndDown" : ""
            }`}
          >
            {message.text}
          </div>
          <form
            onSubmit={handleLogin}
            className="border-black border-2 rounded-md"
          >
            <div style={{ margin: "10px" }}>
              Username:
              <input
                autoComplete="off"
                name="username"
                className="border-b-2 border-b-solid border-b-black"
                value={credientals.username}
                onChange={handleChange}
              />
            </div>
            <div style={{ margin: "10px" }}>
              Password:
              <input
                autoComplete="off"
                className="border-b-2 border-b-solid border-b-black"
                value={credientals.password}
                name="password"
                onChange={handleChange}
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
