import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';

export interface MobadraRequest {
  id?: string;
  name: string;
  phone: string;
  city: string;
  hospitalNeeded: string;
  notes?: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedCoordinator?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'mobadra_requests';

export async function createMobadraRequest(data: Omit<MobadraRequest, 'id' | 'createdAt' | 'status' | 'assignedCoordinator'>) {
  const reqsRef = collection(db, COLLECTION_NAME);
  return await addDoc(reqsRef, {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });
}

export async function getMobadraRequests(): Promise<MobadraRequest[]> {
  const reqsRef = collection(db, COLLECTION_NAME);
  const q = query(reqsRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<MobadraRequest, 'id'>)
  }));
}

export async function assignCoordinator(id: string, coordinatorName: string) {
  const reqRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(reqRef, {
    assignedCoordinator: coordinatorName,
    status: 'assigned'
  });
}

export async function completeMobadraRequest(id: string) {
  const reqRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(reqRef, {
    status: 'completed'
  });
}
