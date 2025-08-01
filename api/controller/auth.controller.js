import { signInUser, createUser, signOutUser, newUserDoc, userForgotPassword } from "../services/firebase/auth.sevices";
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

export const signUp = async ( req ) => {
    const { email, password, role } = req;
    try{
        const userCredentials = await createUser(email, password);
        await newUserDoc(userCredentials, role);

        // console.log(userDoc)

        return { 
            status: HttpStatus.OK, 
            message: "User created successfully" ,
        }
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

export const forgotPassword = async ( email ) => {
    try{
        // const { email } = req;

        if(!email) throw new Error("Email not specified")

        await userForgotPassword(email);
        return { 
            status: HttpStatus.OK, 
            message: "User signed out successfully" 
        };
    }catch(error){
        console.error(`Forgot password Error: ${error.message}`);
        return { 
            status: HttpStatus.BAD_REQUEST, 
            message: error.message 
        };
    }
}