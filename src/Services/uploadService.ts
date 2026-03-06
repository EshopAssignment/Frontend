import {api} from "@/lib/http"
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";


export type RequestUploadRes = 
    NonNullable<Awaited<ReturnType<typeof sdk.postApiBlobUploadRequest>>["data"]>;


export async function requestProductImageUpload(fileName: string, contentType: string): Promise<RequestUploadRes> {
    const res = await sdk.postApiBlobUploadRequest({
    client: api,
    body: { fileName, contentType },
  });
  if (res.error) throw res.error;
  return res.data!;
}

export async function uploadToBlob(uploadUrl: string, file: File, opts?: { signal?: AbortSignal }) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Blob upload failed: ${res.status} ${res.statusText} ${text}`);
  }
}

export async function uploadImageAndGetPublicUrl(file: File, opts?: { signal?: AbortSignal }) {
  const { uploadUrl, publicUrl } = await requestProductImageUpload(file.name, file.type);
  await uploadToBlob(uploadUrl, file, opts);
  return publicUrl;
}