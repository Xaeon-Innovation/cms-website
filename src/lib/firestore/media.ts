import { db } from "../firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

export type HomeVideos = {
  hero?: string;
  medicalMarketing?: string;
  digitalMarketing?: string;
  eventsOrganising?: string;
};

export type MediaSettings = {
  homeVideos?: HomeVideos;
  updatedAt?: Timestamp;
};

const DOC_PATH = { collection: "settings", id: "media" } as const;

export async function getMediaSettings(): Promise<MediaSettings | null> {
  const ref = doc(db, DOC_PATH.collection, DOC_PATH.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as MediaSettings;
}

export async function updateHomeVideos(patch: HomeVideos) {
  const ref = doc(db, DOC_PATH.collection, DOC_PATH.id);
  return await setDoc(
    ref,
    {
      homeVideos: patch,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

