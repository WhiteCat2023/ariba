import { HttpStatus } from "@/enums/status";
import { getAllReportsFromFirebase, getUserReportsFromFirebase } from "../services/firebase/report.service";

export const getUserReports = async (uid) => {
  try {
    const reports = await getUserReportsFromFirebase(uid);

    return {
      status: HttpStatus.OK,
      data: reports,
    };
  } catch (error) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const getAllReports = async () => {
  try {
    const allReports = await getAllReportsFromFirebase()
    return {
      status: HttpStatus.OK,
      data: allReports,
    };
  } catch (error) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    };
  }
}
