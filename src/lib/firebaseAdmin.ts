import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    try {
      // Stored as JSON string in env (common on Vercel)
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Local/dev fallback: allow providing a file path.
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!filePath) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    const contents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(contents);
  } catch {
    return null;
  }
}

export function getAdminAuth() {
  if (!getApps().length) {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
    }
    initializeApp({ credential: cert(serviceAccount) });
  }

  return getAuth();
}

export function getAdminDb() {
  if (!getApps().length) {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
    }
    initializeApp({ credential: cert(serviceAccount) });
  }

  return getFirestore();
}

