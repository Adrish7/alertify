import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../lib/firebase/Authentication/PasswordAuth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      forgotPassword(email, navigate);
    }} className="flex flex-col gap-4 mt-10">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Password
      </button>
    </form>
  );
}