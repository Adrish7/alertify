import {auth} from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // we can return this result and save the user information in firestore - should do later
  return result;

}

export const doSignOut = () => {
  return auth.signOut();
}
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
}
export const doPasswordUpdate = (password) => {
  return updatePassword(auth.currentUser, password);
}
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser,{
    url: `${window.location.origin}/home`,
  });

}
