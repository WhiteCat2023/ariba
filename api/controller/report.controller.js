import { HttpStatus } from "@/enums/status";
import { getAllReportsFromFirebase, getAllTierReportsFromFirebase, getUserReportsFromFirebase } from "../services/firebase/report.service";

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

export const getAllReportsWithFilter = async ( req = null ) => {
  try {
    const allReports = await getAllReportsFromFirebase( req );
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
};

export const getAllTierReportsWithFilter = async (req = null) => {
  try {
    const allReports = await getAllTierReportsFromFirebase(req);
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
};
