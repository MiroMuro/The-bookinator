import { useState } from "react";

const useForm = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return [state, handleChange];
};

export default useForm;
