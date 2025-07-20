import { signInUser, createUser, signOutUser } from "../services/auth.sevices";
import { newUserDoc } from "../services/firestore.services";
// import { HttpStatus }  from "../../enums/status";

export const signIn = async ( req ) => {
    const { email, password} = req.body;
    try{
        const userCredentials = await signInUser(email, password);
        
        return userCredentials;
    }catch(error){
        console.error(`Sign In Error: ${error.message}`);
    };
};

export const user = async ( req ) => {
    const {email, password} = req.body;
    try{
        const userCredentials = await createUser(email, password);
        const userDoc = await newUserDoc(userCredentials);

        console.log(userDoc)
        
        return userCredentials;
    }catch(error){
        console.error(`Creating User Error: ${error.message}`);
    };
};

export const signOut = async ( req ) => {
    try{
        const idExist = req.uid;
        if(!idExist) throw new Error("User id not found")

        await signOutUser();

    }catch(error){
        console.error(`Sign out Error: ${error.message}`);
    };
};