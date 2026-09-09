import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import admin from "firebase-admin";
import { uploadFileToVps } from "./lib/vps-upload.mjs";

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function contentTypeFromExt(ext) {
  const e = ext.toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".webp") return "image/webp";
  return "application/octet-stream";
}

function initFirebaseAdmin() {
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    const fromPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fallback = path.resolve(
      __dirname,
      "..",
      "cms-website-6312a-firebase-adminsdk-fbsvc-b203be3ed3.json"
    );
    const filePath = fromPath ? path.resolve(fromPath) : fallback;
    if (fs.existsSync(filePath)) {
      raw = fs.readFileSync(filePath, "utf8");
    }
  }

  if (!raw) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY (or FIREBASE_SERVICE_ACCOUNT_PATH / cms-website-6312a-firebase-adminsdk-fbsvc-b203be3ed3.json)"
    );
  }

  const serviceAccount = JSON.parse(raw);
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  return admin.firestore();
}

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function roleFor(department, name) {
  const specific = {
    "Mahmoud Imam": "Founder - CEO",
    "Mohamed Elasrg": "Executive Director",
    "Amr Shaaban": "Development Manager",
    "Noha Elmaghraby": "Office Manager",
    "Osama Mohamed": "Accountant",
  };
  if (specific[name]) return specific[name];

  if (department === "Sales" || department === "Coordinators") return "Sales coordinator";
  if (department.toLowerCase() === "logistic support") return "Logistics support";

  return "Team member";
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = path.resolve(__dirname, "..");
  const employeesDir = path.join(root, "public", "assets", "employees");

  const secret = process.env.MEDIA_UPLOAD_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const uploadUrl =
    process.env.MEDIA_UPLOAD_URL ||
    (baseUrl ? `${baseUrl.replace(/\/$/, "")}/upload` : "");

  if (!secret || !baseUrl || !uploadUrl) {
    throw new Error(
      "Set MEDIA_UPLOAD_SECRET, NEXT_PUBLIC_MEDIA_BASE_URL (and optionally MEDIA_UPLOAD_URL) before seeding."
    );
  }

  if (!fs.existsSync(employeesDir)) {
    throw new Error(`Employees folder not found: ${employeesDir}`);
  }

  const firestore = initFirebaseAdmin();
  const files = Array.from(walk(employeesDir)).filter((f) =>
    [".png", ".jpg", ".jpeg", ".webp"].includes(path.extname(f).toLowerCase())
  );

  console.log(`Found ${files.length} images under public/assets/employees`);

  for (const filePath of files) {
    const rel = path.relative(employeesDir, filePath);
    const parts = rel.split(path.sep);
    const department = parts.length > 1 ? parts[0] : "general";
    const base = path.basename(filePath, path.extname(filePath)).trim();
    const ext = path.extname(filePath).toLowerCase().replace(".", "") || "webp";
    const pathname = `employees/${slugify(department)}/${slugify(base)}.${ext}`;

    console.log(`Uploading ${rel} -> ${pathname}`);
    const uploaded = await uploadFileToVps({
      secret,
      uploadUrl,
      baseUrl,
      pathname,
      filePath,
      contentType: contentTypeFromExt(path.extname(filePath)),
    });

    const docId = `${slugify(department)}__${slugify(base)}`;
    await firestore
      .collection("employees")
      .doc(docId)
      .set(
        {
          name: base,
          role: roleFor(department, base),
          department,
          imageUrl: uploaded.url,
          blobPath: uploaded.pathname,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log(`  upserted Firestore doc ${docId}`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
