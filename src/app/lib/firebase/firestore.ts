import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc, 
  DocumentReference, 
  serverTimestamp,
  DocumentData as FirestoreDocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from "./firebase";
import { DocumentData } from "../types";

// Add a new user
export const registerUser = async (name: string, email: string, password: string) => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      console.log("updateProfile in");
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        name,
      });
      console.log("register user info: ", user.email, user.uid, name);
    }

    console.log('User registered:', user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};

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
export const getDocuments = async (collectionName: string): Promise<Array<DocumentData>> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: Array<DocumentData> = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreDocumentData;
      documents.push({
        investigationId: doc.id,
        title: data.title,
        description: data.description,
        image: '/default-image.jpg',
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown Date',
        fileURL: data.fileURL,
        createdAt: data.createdAt,
        userId: data.userId,
      });
    });

    return documents;
  } catch (e) {
    console.error("Error getting all investigations: ", e);
    throw new Error("Failed to retrieve all investigations");
  }
};

// Get a document
export const getDocument = async (collectionName: string, id: string): Promise<FirestoreDocumentData | undefined> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as FirestoreDocumentData;
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (e) {
    console.error("Error getting document:", e);
    throw new Error("Failed to get document");
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

// Search documents
export const searchFirestore = async (searchTerm: string): Promise<Array<DocumentData>> => {
  try {
    const q = collection(db, 'investigations');
    const querySnapshot: QuerySnapshot<FirestoreDocumentData> = await getDocs(q);
    const documents: Array<DocumentData> = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreDocumentData;
      
      if (
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        documents.push({
          investigationId: doc.id,
          createdAt: data.createdAt,
          description: data.description,
          fileURL: data.fileURL,
          title: data.title,
          userId: data.userId,
          image: '/default-investigation.jpg',
          date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown Date',
        });
      }
    });

    return documents;
  } catch (e) {
    console.error("Error searching Firestore: ", e);
    throw new Error("Failed to search Firestore");
  }
};

export default db;
