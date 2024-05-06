const RegisterForm = () => {
  return (
    <div style={{ border: "2px solid black", width: "20%", borderRadius: 10 }}>
      <form>
        <div style={{ margin: "10px" }}>
          Username
          <div>
            <input />
          </div>
        </div>
        <div style={{ margin: "10px" }}>
          Password
          <div>
            <input />
          </div>
        </div>
        <div style={{ margin: "10px" }}>
          Password again!
          <div>
            <input />
          </div>
        </div>
        <button type="submit" style={{ margin: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
