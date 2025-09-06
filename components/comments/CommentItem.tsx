// components/comments/CommentItem.tsx
"use client";
import React, { useMemo, useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import CommentComposer from "./CommentComposer";

type User = { _id: string; username?: string; profilePic?: string };
type Comment = {
  _id: string;
  content: string;
  createdAt?: string;
  user?: User;
  parentId?: any;
  replyToUserId?: User | string | null;
  taggedUserIds?: User[] | string[];
};

function getTimeAgo(date?: string | Date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const m = Math.floor(diffMs / (1000 * 60));
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

export default function CommentItem({
  comment,
  currentUserId,
  onDeleteLocal,
  onReplyAdded,
  fetchReplies, // optional fn to fetch replies for this comment if needed
}: {
  comment: Comment;
  currentUserId?: string | null;
  onDeleteLocal?: (id: string) => void; // remove from parent's array after animation
  onReplyAdded?: () => void; // notify parent to refetch replies
  fetchReplies?: () => Promise<any>; // optional, not required
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);

  const replyToName = useMemo(
    () =>
      (typeof comment.replyToUserId === "string" ? comment.replyToUserId : (comment.replyToUserId as any)?.username) ||
      undefined,
    [comment.replyToUserId]
  );

  const handleDelete = async () => {
    if (!comment._id) return;
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    setMenuError(null);
    setDeleting(true);

    try {
      await sdk.deleteComment({ commentId: comment._id } as any);
      // animate out
      setRemoving(true);
      setTimeout(() => {
        onDeleteLocal?.(comment._id);
      }, 240);
    } catch (err: any) {
      console.error("delete comment failed", err);
      setMenuError(err?.message || "Failed to delete comment");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`transition-all duration-200 ${removing ? "opacity-0 -translate-y-2" : "opacity-100"}`}
    >
      <div className="flex gap-3 items-start py-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
          {(comment.user?.username ?? "U").charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="bg-background/30 rounded-xl p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-textColor">{comment.user?.username ?? "Unknown"}</div>
                  <div className="text-xs text-subTextColor">{getTimeAgo(comment.createdAt)}</div>
                </div>

                <div className="mt-1 text-sm text-textColor whitespace-pre-wrap">{comment.content}</div>

                {menuError && <div className="text-xs text-destructive mt-2">{menuError}</div>}
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  {currentUserId && currentUserId === (comment.user?._id as any) && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-xs text-destructive px-2 py-1 rounded hover:bg-background/20 transition-colors"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  )}

                  <button
                    onClick={() => setShowReplyBox((s) => !s)}
                    className="text-xs text-subTextColor px-2 py-1 rounded hover:bg-background/20 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reply box */}
          {showReplyBox && (
            <div className="mt-2 ml-12">
              <CommentComposer
                postId={(comment as any).postId ?? ""}
                parentId={comment._id}
                replyToUsername={replyToName}
                currentUserId={currentUserId}
                onDone={() => {
                  setShowReplyBox(false);
                  onReplyAdded?.();
                  // optionally re-fetch replies if using fetchReplies()
                  fetchReplies?.();
                }}
                onCancel={() => setShowReplyBox(false)}
              />
            </div>
          )}

          {/* Replies (if fetchReplies provided, parent will render them) */}
        </div>
      </div>
    </div>
  );
}
