import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'admins';

export async function isAdminUser(uid: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, COLLECTION_NAME, uid));
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function createAdminUser(uid: string, email: string) {
  // Only use this function for initial setup or by an existing admin cloud function
  await setDoc(doc(db, COLLECTION_NAME, uid), {
    email,
    createdAt: new Date().toISOString()
  });
}

export async function getAllAdmins() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
}

export async function deleteAdminUser(uid: string) {
  // Note: This removes their access by deleting the 'admin' document.
  // Full deletion from Firebase Auth requires the Admin SDK, but this
  // successfully revokes their ability to log into the dashboard right away.
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, uid));
  } catch (error) {
    console.error("Error deleting admin document:", error);
    throw error;
  }
}
