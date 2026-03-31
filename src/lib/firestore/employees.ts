import { db } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
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
const SETTINGS_COLLECTION = "settings";
const EMPLOYEE_SETTINGS_DOC = "employees";

export interface EmployeeSettings {
  departmentOrder: string[];
}

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

export async function getEmployeeSettings(): Promise<EmployeeSettings> {
  const ref = doc(db, SETTINGS_COLLECTION, EMPLOYEE_SETTINGS_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { departmentOrder: [] };
  }

  const data = snap.data() as Partial<EmployeeSettings>;

  return {
    departmentOrder: Array.isArray(data.departmentOrder)
      ? data.departmentOrder.filter(
          (value): value is string => typeof value === "string" && value.trim().length > 0
        )
      : [],
  };
}

export async function saveEmployeeDepartmentOrder(departmentOrder: string[]) {
  const ref = doc(db, SETTINGS_COLLECTION, EMPLOYEE_SETTINGS_DOC);
  return await setDoc(
    ref,
    {
      departmentOrder,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

