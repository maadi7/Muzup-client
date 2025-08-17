"use client";

import React, { useState, useEffect } from "react";
import { sdk } from "@/utils/graphqlClient";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { useSession } from "next-auth/react";

type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  resourceType?: string;
  waveformUrl?: string;
  error?: string;
};

export default function PostComposer({ onPostCreated }: { onPostCreated?: () => void }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // cleanup preview url on unmount
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      return;
    }

    // accept only single file (replace previous)
    setFile(f);

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(null);
  };

  const guessPostType = (f?: File): "Image" | "Video" | "Audio" => {
    if (!f) return "Image";
    if (f.type.startsWith("image/")) return "Image";
    if (f.type.startsWith("video/")) return "Video";
    if (f.type.startsWith("audio/")) return "Audio";
    return "Image";
  };

  const guessResourceType = (f: File): "image" | "video" | "auto" => {
    if (f.type.startsWith("image/")) return "image";
    if (f.type.startsWith("video/") || f.type.startsWith("audio/")) return "video";
    return "auto";
  };

  const handleSubmit = async () => {
    setError(null);

    if (!content.trim() && !file) {
      setError("Please add text or attach a file.");
      return;
    }

    setSubmitting(true);

    try {
      let postUrl: string | undefined;
      let waveUrl: string | undefined;
      let postType: "Image" | "Video" | "Audio" | undefined;

      if (file) {
        // if user provided both text + media, prioritize media for postType
        postType = guessPostType(file);

        // Build publicId using user id or fallback timestamp
        const ownerId = (session as any)?.user?.id ?? Date.now().toString();
        const safeName = file.name.replace(/\s+/g, "-").slice(0, 64);
        const publicId = `${ownerId}-${Date.now()}-${safeName}`;

        // Upload to Cloudinary via helper
        const resourceType = guessResourceType(file);
        const uploadRes: UploadResult = await uploadToCloudinary(file, "muzup/posts", publicId, resourceType);

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || "Cloudinary upload failed");
        }

        postUrl = uploadRes.url;
        if (uploadRes.waveformUrl) waveUrl = uploadRes.waveformUrl;
      }

      // Build PostInput for server.
      // IMPORTANT: do NOT include postType/postUrl if this is a text-only post.
      const input: any = {
        caption: content.trim() || undefined,
        visibleTo: [] as string[],
      };

      if (file) {
        // include only when file exists
        input.postType = postType;
        input.postUrl = postUrl;
        if (waveUrl) input.waveUrl = waveUrl;
      }

      // Call SDK - using 'as any' to avoid strict enum/casing TS issues if needed
      const res = await sdk.createPost({ input } as any);

      if (res?.createPost) {
        setContent("");
        clearFile();
        if (onPostCreated) onPostCreated();
      } else {
        setError("Failed to create post — server returned false.");
      }
    } catch (err: any) {
      console.error("create post error", err);
      setError(err?.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-lg border p-4 space-y-3"
      style={{
        background: "var(--secondaryBg)",
        borderColor: "var(--sidebar-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <textarea
        className="w-full bg-transparent resize-none min-h-[96px] text-textColor placeholder:subTextColor outline-none"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ fontFamily: "var(--font-secondary)" }}
      />

      {preview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative rounded overflow-hidden bg-background border border-border/10 p-1">
            {file?.type.startsWith("video/") ? (
              <video src={preview} className="w-full h-32 object-cover rounded" controls />
            ) : file?.type.startsWith("audio/") ? (
              <audio src={preview} className="w-full" controls />
            ) : (
              <img src={preview} alt="preview" className="w-full h-32 object-cover rounded" />
            )}
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-background/70 rounded px-2 py-0.5 text-xs text-textColor hover:opacity-90"
              aria-label="Remove file"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* polished Attach button */}
          <label
            htmlFor="file-input"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border/10 bg-background hover:bg-accent/10 cursor-pointer select-none"
            style={{ fontFamily: "var(--font-primary)" }}
            title="Attach image, video or audio"
          >
            {/* paperclip icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.5V6a4 4 0 0 0-4-4H8a6 6 0 0 0-6 6v8a4 4 0 0 0 4 4h9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 7v8a4 4 0 0 0 4 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <span className="text-sm text-subTextColor">Attach</span>
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <div className="flex items-center gap-2 px-2 py-1 rounded text-sm bg-background/30 border border-border/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-textColor max-w-[220px] truncate">{file.name}</span>
              <button onClick={clearFile} className="text-xs text-subTextColor hover:text-textColor ml-2">Remove</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {error && <div className="text-destructive text-sm">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg font-medium transition-transform transform ${
              submitting
                ? "opacity-60 cursor-not-allowed"
                : "bg-muzupColor text-white hover:scale-105 cursor-pointer"
            }`}
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
