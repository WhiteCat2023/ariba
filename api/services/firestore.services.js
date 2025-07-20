import { setDoc, doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase.config";

export async function newUserDoc(userCredentials) {
    try {
        const uid = userCredentials.user.uid;
        await setDoc(doc(db, "users", uid), {
            name: userCredentials.user.displayName,
            email: userCredentials.user.email,
            phone: userCredentials.user.phoneNumber,
            photoUrl: userCredentials.user.photoUrl,
            providerId: userCredentials.user.providerId,
            createdAt: userCredentials.user.metadata.creationTime,
            lastSignedIn: userCredentials.user.metadata.lastSignInTime

        });
        return uid;
    } catch (error) {
        console.error(`Firestore Error: ${error.message}`);
        throw error;
    };
};

export function getAllUsers(callback) {
  try {
    const usersRef = collection(db, 'users');

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(users); 
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time users listener:', error);
  }
}

export function getUserById(uid, callback) {
  try {
    const userDocRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const user = { id: docSnap.id, ...docSnap.data() };
        callback(user);
      } else {
        console.warn("User not found");
        callback(null); 
      }
    });

    return unsubscribe; // Cleanup when needed
  } catch (error) {
    console.error("Real-time getUserById error:", error);
  }
}