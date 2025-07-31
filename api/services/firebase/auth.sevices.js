// working on this
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase.config";

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

export async function newUserDoc(userCredentials, role) {
    try {
        const {
          uid, 
          displayName, 
          email, 
          phoneNumber, 
          photoUrl, 
          providerId, 
          metadata } = userCredentials.user;

        if (!role) throw new Error('Role not specified')

        await setDoc(doc(db, "users", uid), {
            name: displayName,
            email: email,
            phone: phoneNumber || null,
            photoUrl: photoUrl  || null,
            providerId: providerId,
            createdAt: metadata.creationTime,
            lastSignedIn: metadata.lastSignInTime,
            role: role
        });
    } catch (error) {
        console.error(`Firestore Error: ${error.message}`);
        throw error;
    };
};


