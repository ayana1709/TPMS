import { useEffect, useState } from "react";
import api from "./api";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/test")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return <h1>{message || "Connecting..."}</h1>;
};

export default App;
