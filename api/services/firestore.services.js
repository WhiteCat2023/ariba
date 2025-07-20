import { setDoc, doc } from "firebase/firestore";

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