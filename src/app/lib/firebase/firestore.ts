import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc, 
  doc, 
  DocumentReference, 
  serverTimestamp,
  DocumentData as FirestoreDocumentData 
} from "firebase/firestore";
import { db } from "./firebase";
import { DocumentData } from "../types";

// Initialize Firestore
//const db = getFirestore(app);

// Add a new document
export const addDocument = async (collectionName: string, data: DocumentData): Promise<string | undefined> => {
  try {
    const docRef: DocumentReference<FirestoreDocumentData> = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding investigation: ", e);
    throw new Error("Failed to add investigation");
  }
};

// Get all documents
export const getDocuments = async (collectionName: string): Promise<Array<DocumentData & { id: string }>> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: Array<DocumentData & { id: string }> = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreDocumentData;
      documents.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        image: '/default-image.jpg',
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown Date',
        fileURL: data.fileURL,
        createdAt: data.createdAt,
      });
    });

    return documents;
  } catch (e) {
    console.error("Error getting investigation: ", e);
    throw new Error("Failed to retrieve investigation");
  }
};

// Update a document
export const updateDocument = async (collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (e) {
    console.error("Error updating investigation: ", e);
    throw new Error("Failed to update investigation");
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting investigation: ", e);
    throw new Error("Failed to delete investigation");
  }
};

export default db;
