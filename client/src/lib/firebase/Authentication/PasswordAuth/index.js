import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.js";
export const forgotPassword = async (email, navigate) => {
  try {
    // check if email is valid
    if (email === "") {
      alert("Please enter a valid email address.");
      return;
    }
    // send password reset email
    await sendPasswordResetEmail(auth, email);
    navigate("/login");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}