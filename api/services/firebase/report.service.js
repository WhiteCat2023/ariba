import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.config";

export const getUserReportsFromFirebase = async (uid) => {
  try {
    const reportsRef = collection(db, "reports", uid, "reportCollection");
    const snapshot = await getDocs(reportsRef);

    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reports;
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw error;
  }
};

export const getAllReportsFromFirebase = async () => {
  try {
    const reportsRef = collection(db, "allReports");
    const snapshot = await getDocs(reportsRef);

    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reports;
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw error;
  }
};
