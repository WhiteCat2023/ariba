import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase.config";

export async function upload( req ) {
    const { uri, metadata } = req;
    const fileName = uri.split("/").pop();
    const storagePath = `uploads/${fileName}`;
    const fileRef = ref(storage, storagePath)
    
    if(!req) throw new Error("Photo/Video not provided");
    try {
        await uploadBytes(fileRef, metadata)
    } catch (error) {
        console.error(`Firestore Error: ${error.message}`);
        throw error;
    }
}