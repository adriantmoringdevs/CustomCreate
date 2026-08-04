import { useEffect, useState } from "react";
import LoginSignup from "./pages/LoginSignup"

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Backend Status: {message}</h1>

    </div>
  );
}
export default App;
