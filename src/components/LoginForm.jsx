import useForm from "../hooks/useForm";
import useLogin from "../hooks/useLogin";
import PropTypes from "prop-types";

const LoginForm = ({ setToken, token }) => {
  const [credentials, handleChange] = useForm({ username: "", password: "" });
  const { message, isAnimating, isProcessing, handleLogin, logout } =
    useLogin(setToken);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(credentials);
  };

  const handleLogOut = (event) => {
    event.preventDefault();
    handleChange({ target: { name: "username", value: "" } });
    handleChange({ target: { name: "password", value: "" } });
    logout();
  };
  return (
    <div className="flex w-80 mx-auto justify-center sm:justify-end sm:mb-2  flex-col md:w-10/12 md:mx-0">
      {token ? (
        <LoggedInView logout={handleLogOut} />
      ) : (
        <LoginView
          credentials={credentials}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          message={message}
          isAnimating={isAnimating}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string,
};

const LoggedInView = ({ logout }) => (
  <div
    data-test="logged-in-view"
    className="mb-4  flex flex-col items-center justify-center md:justify-end md:items-start"
  >
    <div className="rounded-md border-2 border-black p-4">
      <h2 className="mb-2 rounded bg-red-200 p-2 text-center">
        Already logged in
      </h2>
      <div
        data-test="logout-button"
        className="my-2 w-1/2 rounded-lg border-2 border-solid border-black p-1 text-center transition duration-500 ease-linear hover:scale-110 hover:border-transparent hover:bg-black hover:text-white"
      >
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  </div>
);

LoggedInView.propTypes = {
  logout: PropTypes.func.isRequired,
};

const LoginView = ({
  credentials,
  handleChange,
  handleSubmit,
  message,
  isAnimating,
  isProcessing,
}) => (
  <div className="flex w-80 flex-col justify-end py-3">
    <div
      className={`${message.style} ${
        isAnimating ? "animate-scaleUpAndDown" : ""
      }`}
    >
      {message.text}
    </div>
    <form
      data-test="login-form"
      onSubmit={handleSubmit}
      className="rounded-md border-2 border-black"
    >
      <InputField
        dataTest={"username-div"}
        label="Username:"
        name="username"
        value={credentials.username}
        onChange={handleChange}
      />
      <InputField
        dataTest={"password-div"}
        label="Password:"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <div className="flex justify-between">
        <SubmitButton isProcessing={isProcessing} />
      </div>
    </form>
  </div>
);

LoginView.propTypes = {
  credentials: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  dataTest,
}) => (
  <div data-test={dataTest} style={{ margin: "10px" }}>
    {label}
    <input
      autoComplete="off"
      name={name}
      type={type}
      className="border-b-2 border-solid border-b-black w-full"
      value={value}
      onChange={onChange}
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  dataTest: PropTypes.string,
};

const SubmitButton = ({ isProcessing }) => (
  <button data-test="login-button" type="submit" className="loginButton">
    {isProcessing ? (
      <>
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
        <span>Processing...</span>
      </>
    ) : (
      <>
        {/*Dont remove this div! Used for grid spacing*/}
        <div></div>
        <span>Login</span>
      </>
    )}
  </button>
);

SubmitButton.propTypes = {
  isProcessing: PropTypes.bool.isRequired,
};

export default LoginForm;
