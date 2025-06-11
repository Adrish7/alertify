import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';


export const registerUser = async (name, email, password, setIsLoading, navigate) => {
  try {
    setIsLoading
    // create a new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const results = userCredential.user;

    // send email verification
    await sendEmailVerification(results);
    alert(`Verification email sent to ${email}. Please check your inbox for confirmation.`);
  } catch (error) {
    
  } finally {
    setIsLoading(false); 
    navigate('/login');
    
  }

}

export const loginUserWithEmailAndPassword = async (email, password, navigate) => {
  console.log(email, password);
  try {
    console.log(email, password);
    // log in user 
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const results = userCredential.user;
    if (results.emailVerified === false) {
      alert('Please verify your email before logging in.');
      return;
    }
    navigate('/app');
  } catch (error) {
    console.error('Error logging in:', error);
    alert('Login failed. Please check your email and password.');
    
  } 
}