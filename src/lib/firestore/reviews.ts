import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where, Timestamp } from 'firebase/firestore';

export interface Review {
  id?: string;
  name: string;
  type: 'clinic' | 'patient' | 'mobadra';
  rating: number; // 1-5
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'reviews';

export async function createReview(data: Omit<Review, 'id' | 'createdAt' | 'status'>) {
  const reviewsRef = collection(db, COLLECTION_NAME);
  return await addDoc(reviewsRef, {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });
}

export async function getApprovedReviews(typeFilter?: Review['type']): Promise<Review[]> {
  const reviewsRef = collection(db, COLLECTION_NAME);
  
  // Basic query for approved reviews
  const filters: any[] = [where('status', '==', 'approved')];
  if (typeFilter) {
    filters.push(where('type', '==', typeFilter));
  }
  
  const q = query(reviewsRef, ...filters, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Review, 'id'>)
  }));
}

export async function getAllPendingReviews(): Promise<Review[]> {
  const reviewsRef = collection(db, COLLECTION_NAME);
  const q = query(reviewsRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Review, 'id'>)
  }));
}

export async function updateReviewStatus(id: string, newStatus: Review['status']) {
  const reviewRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(reviewRef, {
    status: newStatus
  });
}
