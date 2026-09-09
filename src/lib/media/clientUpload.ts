"use client";

async function readError(res: Response) {
  const payload = await res.json().catch(() => ({}));
  return (payload as { error?: string })?.error || `Request failed (${res.status})`;
}

type MintResponse = {
  token: string;
  pathname: string;
  uploadUrl: string;
  publicUrl: string;
  contentType: string;
  maxBytes: number;
};

export async function uploadToVps(options: {
  idToken: string;
  mintUrl: string;
  mintBody: Record<string, unknown>;
  file: File;
}): Promise<{ url: string; pathname: string }> {
  const mintRes = await fetch(options.mintUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.mintBody),
  });

  if (!mintRes.ok) {
    throw new Error(await readError(mintRes));
  }

  const mint = (await mintRes.json()) as MintResponse;

  if (options.file.size > mint.maxBytes) {
    throw new Error(`File too large (max ${mint.maxBytes} bytes)`);
  }

  const uploadRes = await fetch(mint.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mint.contentType || options.file.type || "application/octet-stream",
      "X-Media-Token": mint.token,
      "X-Media-Pathname": mint.pathname,
    },
    body: options.file,
  });

  if (!uploadRes.ok) {
    throw new Error(await readError(uploadRes));
  }

  return { url: mint.publicUrl, pathname: mint.pathname };
}

export async function deleteFromVps(options: {
  idToken: string;
  pathname: string;
}) {
  const res = await fetch("/api/employees/delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pathname: options.pathname }),
  });

  if (!res.ok) {
    throw new Error(await readError(res));
  }
}
