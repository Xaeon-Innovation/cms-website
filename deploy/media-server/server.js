import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express from "express";

const PORT = Number(process.env.PORT || 8787);
const MEDIA_ROOT = path.resolve(process.env.MEDIA_ROOT || "/var/www/cms-media");
const SECRET = process.env.MEDIA_UPLOAD_SECRET || "";
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const MAX_VIDEO_BYTES = Number(process.env.MAX_VIDEO_BYTES || 200 * 1024 * 1024);
const MAX_IMAGE_BYTES = Number(process.env.MAX_IMAGE_BYTES || 5 * 1024 * 1024);

const VIDEO_EXT = new Set([".mp4", ".webm"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

if (!SECRET) {
  console.error("MEDIA_UPLOAD_SECRET is required");
  process.exit(1);
}

fs.mkdirSync(MEDIA_ROOT, { recursive: true });

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function sign(method, pathname, exp) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${method}\n${pathname}\n${exp}`)
    .digest("base64url");
}

function verifyToken(token, method, pathname) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = sign(method, pathname, exp);
  return timingSafeEqual(sig, expected);
}

function isSafePathname(pathname) {
  if (!pathname || typeof pathname !== "string") return false;
  if (pathname.includes("..") || pathname.startsWith("/") || pathname.includes("\\")) {
    return false;
  }
  return true;
}

function classifyPath(pathname) {
  const ext = path.extname(pathname).toLowerCase();
  if (pathname.startsWith("videos/home/") && VIDEO_EXT.has(ext)) {
    return { kind: "video", maxBytes: MAX_VIDEO_BYTES };
  }
  if (pathname.startsWith("employees/") && IMAGE_EXT.has(ext)) {
    const parts = pathname.split("/");
    if (parts.length >= 3) {
      return { kind: "image", maxBytes: MAX_IMAGE_BYTES };
    }
  }
  return null;
}

function resolveSafe(pathname) {
  const abs = path.resolve(MEDIA_ROOT, pathname);
  if (!abs.startsWith(MEDIA_ROOT + path.sep) && abs !== MEDIA_ROOT) {
    return null;
  }
  return abs;
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization,Content-Type,X-Media-Token,X-Media-Pathname"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }
}

const app = express();

app.use((req, res, next) => {
  setCors(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.put(
  "/upload",
  express.raw({
    type: () => true,
    limit: MAX_VIDEO_BYTES,
  }),
  (req, res) => {
    try {
      const pathname = String(req.headers["x-media-pathname"] || "");
      const token = String(req.headers["x-media-token"] || "");

      if (!isSafePathname(pathname)) {
        res.status(400).json({ error: "Invalid pathname" });
        return;
      }

      const rule = classifyPath(pathname);
      if (!rule) {
        res.status(400).json({
          error:
            "Path not allowed. Use videos/home/*.{mp4,webm} or employees/<dept>/*.{png,jpg,webp}",
        });
        return;
      }

      if (!verifyToken(token, "PUT", pathname)) {
        res.status(401).json({ error: "Invalid or expired upload token" });
        return;
      }

      const body = req.body;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ error: "Empty body" });
        return;
      }
      if (body.length > rule.maxBytes) {
        res.status(413).json({ error: `File too large (max ${rule.maxBytes} bytes)` });
        return;
      }

      const abs = resolveSafe(pathname);
      if (!abs) {
        res.status(400).json({ error: "Invalid pathname" });
        return;
      }

      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, body);

      const contentType =
        req.headers["content-type"] ||
        (rule.kind === "video"
          ? pathname.endsWith(".webm")
            ? "video/webm"
            : "video/mp4"
          : "application/octet-stream");

      res.json({
        ok: true,
        pathname,
        size: body.length,
        contentType,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err?.message || "Upload failed" });
    }
  }
);

app.delete("/files", (req, res) => {
  try {
    const pathname = String(req.query.pathname || req.headers["x-media-pathname"] || "");
    const token = String(req.headers["x-media-token"] || "");

    if (!isSafePathname(pathname) || !classifyPath(pathname)) {
      res.status(400).json({ error: "Invalid pathname" });
      return;
    }

    if (!verifyToken(token, "DELETE", pathname)) {
      res.status(401).json({ error: "Invalid or expired delete token" });
      return;
    }

    const abs = resolveSafe(pathname);
    if (!abs) {
      res.status(400).json({ error: "Invalid pathname" });
      return;
    }

    if (fs.existsSync(abs)) {
      fs.unlinkSync(abs);
    }

    res.json({ ok: true, pathname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`cms-media-server listening on :${PORT}`);
  console.log(`MEDIA_ROOT=${MEDIA_ROOT}`);
});
