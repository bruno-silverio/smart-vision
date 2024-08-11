import { getFirestore } from "firebase/firestore";
import { app }  from "../firebase/firebase";
//import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, DocumentReference, DocumentData as FirestoreDocumentData } from "firebase/firestore";
import { DocumentData } from "../types";


// Initialize Firestore
const db = getFirestore(app);
//const storage = getStorage(app);

// Add a new document
export const addDocument = async (data: DocumentData): Promise<string | undefined> => {
  try {
    const docRef: DocumentReference<FirestoreDocumentData> = await addDoc(collection(db, "collection-name"), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Get all documents
export const getDocuments = async (): Promise<Array<DocumentData & { id: string }>> => {
  const querySnapshot = await getDocs(collection(db, "collection-name"));
  const documents: Array<DocumentData & { id: string }> = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() as DocumentData });
  });
  return documents;
};

// Update a document
export const updateDocument = async (id: string, data: Partial<DocumentData>): Promise<void> => {
  const docRef = doc(db, "collection-name", id);
  await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  const docRef = doc(db, "collection-name", id);
  await deleteDoc(docRef);
};

export default db;
