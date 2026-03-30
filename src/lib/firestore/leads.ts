import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'leads';

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>) {
  const leadsRef = collection(db, COLLECTION_NAME);
  return await addDoc(leadsRef, {
    ...data,
    status: 'new',
    createdAt: Timestamp.now()
  });
}

export async function getLeads(): Promise<Lead[]> {
  const leadsRef = collection(db, COLLECTION_NAME);
  const q = query(leadsRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Lead, 'id'>)
  }));
}

export async function updateLeadStatus(id: string, newStatus: Lead['status']) {
  const leadRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(leadRef, {
    status: newStatus
  });
}
