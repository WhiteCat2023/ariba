import { HttpStatus } from "../../enums/status"
import { upload } from "../services/firebase/storage.services"

export const uploadPhotoOrVideo = async (req) => {
    try {
        await upload(req)
        return{
            status: HttpStatus.OK,
            message: "Upload Successful!"
        }
    } catch (error) {
        return{
            status: HttpStatus.BAD_REQUEST,
            message: error.message
        }
    }
}