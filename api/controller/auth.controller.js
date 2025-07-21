import { signInUser, createUser, signOutUser } from "../services/firebase/auth.sevices";
import { newUserDoc } from "../services/firebase/users.services";
// import { HttpStatus }  from "../../enums/status";
import { HttpStatus } from "../../enums/status";

export const signIn = async ( req ) => {
    const { email, password } = req;
    try{
        const userData = await signInUser(email, password);
        
        return { 
            status: HttpStatus.OK, 
            message: "User signed in successfully",
            data: userData  
        };
    }catch(error){
        console.error(`Sign In Error: ${error.message}`);
        return { 
            status: HttpStatus.BAD_REQUEST, 
            message: error.message 
        };
    };
};

export const newUser = async ( req ) => {
    const { email, password } = req;
    try{
        const userCredentials = await createUser(email, password);
        await newUserDoc(userCredentials);

        // console.log(userDoc)

        return { 
            status: HttpStatus.OK, 
            message: "User created successfully" 
        };
    }catch(error){
        console.error(`Creating User Error: ${error.message}`);
        return { 
            status: HttpStatus.BAD_REQUEST, 
            message: error.message 
        };
    };
};

export const signOut = async ( req ) => {
    try{
        const {uid} = req;
        if(!uid) throw new Error("User id not found")

        await signOutUser();
        return { 
            status: HttpStatus.OK, 
            message: "User signed out successfully" 
        };
    }catch(error){
        console.error(`Sign out Error: ${error.message}`);
        return { 
            status: HttpStatus.BAD_REQUEST, 
            message: error.message 
        };
    };
};