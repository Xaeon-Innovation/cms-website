import { db } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export interface Employee {
  id?: string;
  name: string;
  role: string;
  department: string;
  imageUrl: string;
  blobPath: string;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = "employees";

export async function createEmployee(
  data: Omit<Employee, "id" | "createdAt" | "updatedAt">
) {
  const ref = collection(db, COLLECTION_NAME);
  return await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function getEmployees(): Promise<Employee[]> {
  const ref = collection(db, COLLECTION_NAME);
  // Keep this query single-field ordered to avoid requiring a composite index.
  // We sort/group in the UI layer instead.
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Employee, "id">),
  }));
}

export async function updateEmployee(id: string, patch: Partial<Omit<Employee, "id" | "createdAt">>) {
  const ref = doc(db, COLLECTION_NAME, id);
  return await updateDoc(ref, {
    ...patch,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEmployee(id: string) {
  const ref = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(ref);
}

