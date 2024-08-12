import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

// Initialize Firebase Storage
const storage = getStorage(app);

// Upload a file to Firebase Storage
export const uploadFile = async (userId: string, file: File): Promise<string> => {
  try {
    const fileRef = ref(storage, `files/${userId}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (e) {
    console.error("Error uploading file: ", e);
    throw new Error("Failed to upload file");
  }
};

// Get download URL for a specific file
export const getFileURL = async (userId: string, fileName: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `files/${userId}/${fileName}`);
    return await getDownloadURL(fileRef);
  } catch (e) {
    console.error("Error getting file URL: ", e);
    throw new Error("Failed to get file URL");
  }
};

export default storage;