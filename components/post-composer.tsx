"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { sdk } from "@/utils/graphqlClient";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { useSession } from "next-auth/react";
import { useFeedStore } from "@/store/feedStore";
import { useUser } from "@/store/user";
import { User } from "@/generated/graphql";
import Image from "next/image";

type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  resourceType?: string;
  waveformUrl?: string;
  error?: string;
};

export default function PostComposer({
  onPostCreated,
  user: initialUser,
}: {
  onPostCreated?: () => void;
  user?: User | null | undefined;
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { meUser: storeUser } = useUser();
  const currentUser = storeUser || initialUser;
  const incrementRefetchSignal = useFeedStore(
    (state) => state.incrementRefetchSignal
  );

  // textarea ref for caret insertion
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // emoji picker state and refs
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // quick emojis list
  const quickEmojis = ["👍", "❤️", "🔥", "😂", "🎉", "🎵"];

  useEffect(() => {
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
    if (f.type.startsWith("video/") || f.type.startsWith("audio/"))
      return "video";
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
        postType = guessPostType(file);
        const ownerId = (session as any)?.user?.id ?? Date.now().toString();
        const safeName = file.name.replace(/\s+/g, "-").slice(0, 64);
        const publicId = `${ownerId}-${Date.now()}-${safeName}`;

        const resourceType = guessResourceType(file);
        const uploadRes: UploadResult = await uploadToCloudinary(
          file,
          "muzup/posts",
          publicId,
          resourceType
        );

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || "Cloudinary upload failed");
        }

        postUrl = uploadRes.url;
        if (uploadRes.waveformUrl) waveUrl = uploadRes.waveformUrl;
      }

      const input: any = {
        caption: content.trim() || undefined,
        visibleTo: [] as string[],
      };

      if (file) {
        input.postType = postType;
        input.postUrl = postUrl;
        if (waveUrl) input.waveUrl = waveUrl;
      }

      const res = await sdk.createPost({ input } as any);

      if (res?.createPost) {
        setContent("");
        clearFile();
        setFocused(false);
        incrementRefetchSignal();
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

  const hasContent = content.trim().length > 0 || file;

  // helper to get display name initial
  const getInitial = () => {
    const name = (currentUser?.username || "You") as string;
    return name.charAt(0).toUpperCase();
  };

  // Insert emoji at caret. If `replaceWhole` true, replace entire content
  const insertEmoji = useCallback(
    (emoji: string, replaceWhole = false) => {
      if (replaceWhole) {
        setContent(emoji);
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
          const pos = (emoji || "").length;
          textareaRef.current?.setSelectionRange(pos, pos);
        });
      } else {
        const el = textareaRef.current;
        if (!el) {
          setContent((c) => c + emoji);
          return;
        }
        const start = el.selectionStart ?? content.length;
        const end = el.selectionEnd ?? content.length;
        const newContent = content.slice(0, start) + emoji + content.slice(end);
        setContent(newContent);

        requestAnimationFrame(() => {
          el.focus();
          const newPos = start + emoji.length;
          el.setSelectionRange(newPos, newPos);
        });
      }
      setFocused(true);
    },
    [content]
  );

  // close picker on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowEmojiPicker(false);
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [showEmojiPicker]);

  // pick an emoji and close the picker
  const handleEmojiSelect = (em: string) => {
    insertEmoji(em, false);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 ${
        focused ? "shadow-xl shadow-muzupColor/10" : "hover:shadow-xl"
      }`}
      style={{
        background:
          "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar: show profile pic if available, else initial */}
          {currentUser?.profilePic && !imgError ? (
            <Image
              src={currentUser.profilePic}
              alt={(currentUser?.username || "You") + "'s avatar"}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg object-cover"
              onError={() => setImgError(true)}
              width={20}
              height={20}
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {getInitial()}
            </div>
          )}

          <div>
            <div className="text-lg font-semibold text-textColor">
              Create a post
            </div>
            <div className="text-sm text-subTextColor">
              Share what's on your mind
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className={`w-full bg-transparent resize-none text-textColor placeholder:text-subTextColor outline-none transition-all duration-200 ${
              focused ? "min-h-[120px]" : "min-h-[80px]"
            }`}
            placeholder="What's happening? Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => !hasContent && setFocused(false)}
            style={{ fontFamily: "var(--font-secondary)" }}
          />

          {/* Character Counter */}
          {focused && (
            <div className="absolute bottom-2 right-2 text-xs text-subTextColor">
              {content.length}/280
            </div>
          )}
        </div>
      </div>

      {/* File Preview */}
      {preview && (
        <div className="px-6 pb-4">
          <div className="relative rounded-2xl overflow-hidden bg-background/20">
            {file?.type.startsWith("video/") ? (
              <div className="relative">
                <video
                  src={preview}
                  className="w-full max-h-80 object-cover"
                  controls
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded-lg text-white text-xs font-medium backdrop-blur-sm">
                  Video
                </div>
              </div>
            ) : file?.type.startsWith("audio/") ? (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M9 18V5l12-2v13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="6"
                        cy="18"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="16"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-textColor">
                      {file.name}
                    </div>
                    <div className="text-sm text-subTextColor">
                      Audio file • {Math.round(file.size / 1024)}KB
                    </div>
                  </div>
                </div>
                <audio src={preview} className="w-full" controls />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-80 object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded-lg text-white text-xs font-medium backdrop-blur-sm">
                  Image
                </div>
              </div>
            )}

            {/* Remove File Button */}
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all backdrop-blur-sm"
              aria-label="Remove file"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-6 pb-4">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M15 9l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9 9l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className={`px-6 py-4 transition-all ${focused ? "" : ""}`}>
        <div className="flex items-center justify-between">
          {/* Media Controls + Emoji Picker (emoji button toggles floating picker) */}
          <div className="flex items-center gap-2 relative">
            {/* Attach Button */}
            <label
              htmlFor="file-input"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/40 hover:bg-background/60 cursor-pointer transition-all hover:scale-105 transform"
              title="Attach media"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-subTextColor group-hover:text-textColor transition-colors"
              >
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <polyline
                  points="7,10 12,15 17,10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium text-subTextColor group-hover:text-textColor transition-colors">
                Media
              </span>
              <input
                id="file-input"
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={onFileChange}
                className="hidden"
              />
            </label>

            {/* Emoji button: toggles floating picker */}
            <div className="relative">
              <button
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker((s) => !s)}
                title="Add emoji"
                className="group p-2.5 rounded-full hover:bg-background/50 transition-all"
                aria-expanded={showEmojiPicker}
                aria-haspopup="true"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-subTextColor group-hover:text-textColor transition-colors"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 14s1.5 2 4 2 4-2 4-2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="9"
                    y1="9"
                    x2="9.01"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="15"
                    y1="9"
                    x2="15.01"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Floating Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  role="dialog"
                  aria-label="Emoji picker"
                  className="z-50 absolute right-0 bottom-full mb-3 w-44 p-2 rounded-2xl bg-background/95 backdrop-blur-sm border border-border shadow-xl transform-gpu origin-bottom-right animate-fadeInUp"
                  style={{
                    // subtle entrance animation (scale + translate) via inline transition fallback if animate class not defined
                    transition:
                      "transform 180ms cubic-bezier(.2,.9,.25,1), opacity 180ms",
                  }}
                >
                  {/* little arrow */}
                  <div className="absolute right-4 -bottom-2 w-3 h-3 rotate-45 bg-background/95 border-l border-t border-border" />

                  <div className="grid grid-cols-6 gap-2 p-1">
                    {quickEmojis.map((em) => (
                      <button
                        key={em}
                        onClick={() => handleEmojiSelect(em)}
                        className="text-lg w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background/50 transition"
                        aria-label={`Insert ${em}`}
                        title="Click to insert emoji"
                      >
                        {em}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-subTextColor text-center">
                    Click an emoji to insert
                  </div>
                </div>
              )}
            </div>

            {/* Additional Controls */}
            <button
              className="group p-2.5 rounded-full hover:bg-background/50 transition-all"
              title="Add poll"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-subTextColor group-hover:text-textColor transition-colors"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 9h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9 15h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* File Info & Actions */}
          <div className="flex items-center gap-3">
            {file && (
              <div className="flex items-center gap-2 px-3 py-2 bg-background/40 rounded-full">
                <div className="w-2 h-2 rounded-full bg-muzupColor animate-pulse"></div>
                <span className="text-xs font-medium text-textColor max-w-[120px] truncate">
                  {file.name}
                </span>
                <button
                  onClick={clearFile}
                  className="text-xs text-subTextColor hover:text-red-400 transition-colors ml-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Character count indicator */}
            {focused && content.length > 200 && (
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <svg
                    className="w-8 h-8 transform -rotate-90"
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="var(--background)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke={
                        content.length > 280 ? "#ef4444" : "var(--muzupColor)"
                      }
                      strokeWidth="2"
                      strokeDasharray={87.96}
                      strokeDashoffset={87.96 - (content.length / 280) * 87.96}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-xs font-bold ${
                        content.length > 280
                          ? "text-red-400"
                          : "text-subTextColor"
                      }`}
                    >
                      {280 - content.length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Post Button */}
            <button
              onClick={handleSubmit}
              disabled={
                submitting || (!content.trim() && !file) || content.length > 280
              }
              className={`relative px-6 py-2.5 rounded-full font-semibold transition-all transform ${
                submitting || (!content.trim() && !file) || content.length > 280
                  ? "opacity-50 cursor-not-allowed bg-subTextColor/20 text-subTextColor"
                  : "bg-gradient-to-r from-muzupColor to-green-500 text-white hover:shadow-lg hover:shadow-muzupColor/25 hover:scale-105 active:scale-95"
              }`}
              style={{ fontFamily: "var(--font-secondary)" }}
            >
              {submitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <span className={submitting ? "opacity-0" : "opacity-100"}>
                {submitting ? "Posting..." : "Post"}
              </span>
            </button>
          </div>
        </div>

        {/* Expanded Options (when focused) */}
        {focused && (
          <div className="mt-4 pt-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-subTextColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 6v6l4 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-sm text-subTextColor">
                    Post publicly
                  </span>
                </div>

                <button className="text-sm text-muzupColor hover:text-muzupColor/80 transition-colors font-medium">
                  Change audience
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-subTextColor">
                <div className="w-1 h-1 rounded-full bg-muzupColor"></div>
                <span>Everyone can see this post</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
