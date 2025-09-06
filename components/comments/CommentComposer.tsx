// components/comments/CommentComposer.tsx
"use client";
import React, { useState } from "react";
import { sdk } from "@/utils/graphqlClient";

export default function CommentComposer({
  postId,
  parentId,
  replyToUsername,
  currentUserId,
  onDone,
  onCancel,
}: {
  postId: string;
  parentId?: string | null;
  replyToUsername?: string | null;
  currentUserId?: string | null;
  onDone?: () => void; // called after successful submit (parent usually refetches)
  onCancel?: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    setError(null);
    setLoading(true);

    try {
      // if parentId present, it's a reply
      const input = {
        postId,
        content: content.trim(),
        parentId: parentId ?? null,
        replyToUserId: null,
        taggedUserIds: [],
      };

      if (parentId) {
        await sdk.replyToComment({ input } as any);
      } else {
        await sdk.addComment({ input } as any);
      }

      setContent("");
      onDone?.();
    } catch (err: any) {
      console.error("comment submit failed", err);
      setError(err?.message || "Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
          {currentUserId ? (currentUserId as string).slice(-2) : "U"}
        </div>

        <div className="flex-1">
          {replyToUsername && (
            <div className="text-xs text-subTextColor mb-1">
              Replying to <span className="text-muzupColor font-medium">@{replyToUsername}</span>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "Write a comment..."}
            className="w-full resize-none min-h-[44px] max-h-36 p-3 rounded-xl bg-background/30 border border-border/20 text-sm focus:outline-none"
            disabled={loading}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-destructive">{error}</div>
            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={() => {
                    setContent("");
                    onCancel();
                  }}
                  className="px-3 py-1.5 rounded-md text-sm text-subTextColor hover:bg-background/20 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-3 py-1.5 bg-muzupColor text-white rounded-md text-sm font-medium disabled:opacity-60"
              >
                {loading ? "Posting..." : parentId ? "Reply" : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
