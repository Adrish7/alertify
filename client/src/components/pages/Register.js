import { useState } from "react";
import { registerUser } from "../../lib/firebase/Authentication/EmailAuth"; 
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(name, email, password, setIsLoading, navigate);
    //setIsLoading(true);
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Register</h1>
      <form className="flex flex-col gap-4 mt-10" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        placeholder="First Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!email || !password || !name}
      >
        Register
      </button>
    </form>
      
      <a href="/">Back to Home</a>
    </div>
  );
}