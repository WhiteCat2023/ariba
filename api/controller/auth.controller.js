import { signInUser, createUser, signOutUser } from "../auth/services/auth.sevices";
import { newUserDoc } from "../services/firestore.services";

export const signIn = async ( req, res ) => {
    const {email, password} = req.body;
    try{
        const userCredentials = await signInUser(email, password);
        res.status(200).json({
            message: userCredentials.email
        });
        return userCredentials;
    }catch(error){
        console.log(`Sign In Error: ${error.message}`);
        res.status(400).json({message: error.message});
    };
};

export const user = async ( req, res ) => {
    const {email, password} = req.body;
    try{
        const userCredentials = await createUser(email, password);
        const userDoc = await newUserDoc(userCredentials);
        res.status(200).json({
            message: userCredentials.user.email,
            uid: userDoc
        });
        return userCredentials;
    }catch(error){
        console.log(`Creating User Error: ${error.message}`);
        res.status(400).json({message: error.message});
    };
};

export const signOut = async (req, res) => {
    try{
        await signOutUser();
        res.status(200).json({ message: "User sign out" });
    }catch(error){
        console.log(`Sign out Error: ${error.message}`);
        res.status(400).json({message: error.message});
    };
};