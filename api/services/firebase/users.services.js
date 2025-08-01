import { setDoc, doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../config/firebase.config";

export async function updateUserName(credentials){
  try {
    const { uid, name } = credentials;

    if(!uid) throw new Error("User not found");

    await setDoc(doc(db, "users", uid), {
      name: name
    });
    return uid
  } catch (error) {
    console.error(`Firestore Error: ${error.message}`);
    throw error;
  };
};

export async function updateUserPhoneNumber(credentials) {
  try {
    const {uid, phoneNumber} = credentials;

    if(!uid) throw new Error("User not found");

    await setDoc(doc(db, "users", uid), {
      phone: phoneNumber
    })
    return uid
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
    throw error;
  }
}

export function getUserById(uid, callback) {
  try {
    const userDocRef = doc(db, "users", uid);

    if(!uid) throw new Error("User not found")

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
    throw error;
  }
}
