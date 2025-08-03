// working on this
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithCredential} from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { setDoc,doc } from "firebase/firestore";



export async function signInUser(email, password){
   return await signInWithEmailAndPassword(auth, email, password);
}

export async function createUser(email, password){
   return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(){
   return await signOut(auth)
} 

export async function userForgotPassword(email) {
   return await sendPasswordResetEmail(auth, email)
}

export const signInWithToken = async (credential) => {
    return await signInWithCredential(auth, credential)     
}

export async function newUserDoc(userCredentials, role) {
  try {
    const {
      uid,
      displayName,
      email,
      phoneNumber,
      metadata,
      providerData,
    } = userCredentials.user;

    if (!role) throw new Error("Role not specified");

    const providerId = providerData?.[0]?.providerId || null;
    const photoUrl = providerData?.[0]?.photoURL || null;

    await setDoc(doc(db, "users", uid), {
      name: displayName,
      email,
      phone: phoneNumber || null,
      photoUrl,
      providerId,
      createdAt: metadata?.creationTime || null,
      lastSignedIn: metadata?.lastSignInTime || null,
      role,
    });
  } catch (error) {
    console.error(`Firestore Error: ${error.message}`);
    throw error;
  }
}



