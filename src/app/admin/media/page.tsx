"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaSettings, HomeVideos, updateHomeVideos } from "@/lib/firestore/media";

type UploadResult = {
  url: string;
  pathname: string;
};

type Slot = {
  id: keyof Required<HomeVideos>;
  label: string;
  help: string;
};

const slots: Slot[] = [
  { id: "hero", label: "Hero video", help: "Homepage hero background." },
  { id: "medicalMarketing", label: "Medical Marketing", help: "Services preview card video." },
  { id: "digitalMarketing", label: "Digital Marketing", help: "Services preview card video." },
  { id: "eventsOrganising", label: "Events Organising", help: "Services preview card video." },
];

export default function AdminMediaPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState<HomeVideos>({});
  const [files, setFiles] = useState<Partial<Record<Slot["id"], File | null>>>({});

  const refresh = async () => {
    setLoading(true);
    try {
      const settings = await getMediaSettings();
      setUrls(settings?.homeVideos || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  function extFromFile(file: File) {
    const n = file.name.toLowerCase();
    if (n.endsWith(".webm")) return "webm";
    return "mp4";
  }

  const uploadSlot = async (slotId: Slot["id"], file: File): Promise<UploadResult> => {
    if (!user) throw new Error("Not signed in");
    const token = await user.getIdToken();

    const ext = extFromFile(file);
    const pathname = `videos/home/${Date.now()}-${slotId}.${ext}`;

    // Use single-part upload (multipart: false). The MPU endpoint
    // (vercel.com/api/blob/mpu) does not send CORS headers for browser origins.
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/media/handle-upload",
      multipart: false,
      contentType: file.type || (ext === "webm" ? "video/webm" : "video/mp4"),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { url: blob.url, pathname: blob.pathname };
  };

  const onSave = async () => {
    setError(null);
    try {
      setSaving(true);

      const next: HomeVideos = { ...urls };
      for (const slot of slots) {
        const f = files[slot.id];
        if (f) {
          const upload = await uploadSlot(slot.id, f);
          next[slot.id] = upload.url;
        }
      }

      await updateHomeVideos(next);
      setFiles({});
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to save media");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-display text-primary">Media</h1>
          <p className="text-foreground/70 font-body text-sm mt-1">Upload homepage videos to Vercel Blob.</p>
        </div>
        <Badge variant="outline">Homepage videos</Badge>
      </div>

      {error && (
        <div className="text-xs text-error p-3 bg-error-container/20 rounded-sm border border-error/20">{error}</div>
      )}

      <div className="bg-surface-container rounded-sm border border-outline-variant/10 p-8 space-y-8">
        {loading ? (
          <div className="p-6 flex justify-center opacity-70">
            <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {slots.map((slot) => (
              <div key={slot.id} className="space-y-3">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-display text-primary-container">{slot.label}</div>
                    <div className="text-xs text-foreground/50 font-body mt-1">{slot.help}</div>
                  </div>
                  {urls[slot.id] ? (
                    <a
                      href={urls[slot.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-body text-primary hover:underline break-all"
                    >
                      Current URL
                    </a>
                  ) : (
                    <span className="text-xs text-foreground/40 italic">Not set</span>
                  )}
                </div>

                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  aria-label={`${slot.label} file`}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFiles((prev) => ({ ...prev, [slot.id]: file }));
                  }}
                  className="block w-full text-sm text-foreground/70 file:mr-4 file:rounded-sm file:border-0 file:bg-surface-container-high file:px-4 file:py-2 file:text-foreground/80 hover:file:bg-surface-container"
                />
                <div className="text-[10px] text-foreground/40 font-body">
                  Selected: {files[slot.id]?.name || "—"}
                </div>
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between border-t border-outline-variant/10">
              <Button type="button" variant="primary" disabled={saving} onClick={onSave}>
                {saving ? "Uploading..." : "Upload & Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

