// components/comments/CommentList.tsx
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";

type User = { _id: string; username?: string };
type Comment = {
  _id: string;
  content: string;
  createdAt?: string;
  user?: User;
  parentId?: any;
  replies?: Comment[]; // optional if resolver provides nested replies
};

export default function CommentList({
  postId,
  currentUserId,
  initialExpand = false,
}: {
  postId: string;
  currentUserId?: string | null;
  initialExpand?: boolean;
}) {
  const LIMIT = 6;
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(initialExpand);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = useCallback(
    async (p = 1, replace = false) => {
      try {
        if (p === 1) setLoading(true);
        const res = await sdk.getComments({ postId, page: p, limit: LIMIT } as any);
        const data = res?.getComments?? res;
        const arr = Array.isArray(data) ? data : Array.isArray((data as any).items) ? (data as any).items : [];
        if (arr.length === 0 && p === 1) {
          setComments([]);
          setHasMore(false);
          return;
        }
        if (replace) setComments(arr);
        else setComments((prev) => (p === 1 ? arr : [...prev, ...arr]));
        setHasMore(arr.length >= LIMIT);
      } catch (err) {
        console.error("fetch comments failed", err);
      } finally {
        setLoading(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    fetchComments(1, true);
    setPage(1);
  }, [postId, fetchComments]);

  // infinite scroll for more top-level comments
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            const next = page + 1;
            setPage(next);
            fetchComments(next, false);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [loaderRef, page, fetchComments, hasMore, loading]);

  const handleAddLocal = async () => {
    // after creating a comment, re-fetch first page to show newest comment
    await fetchComments(1, true);
    setPage(1);
  };

  const handleDeleteLocal = (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-textColor">Comments</h4>
        <div className="text-xs text-subTextColor">{comments.length} comment{comments.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="space-y-3">
        {/* Composer for top-level comment */}
        <CommentComposer
          postId={postId}
          currentUserId={currentUserId}
          onDone={handleAddLocal}
        />

        {/* Comments list */}
        {loading && comments.length === 0 ? (
          <div className="py-6 text-center text-subTextColor">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center text-subTextColor">No comments yet — be the first to comment.</div>
        ) : (
          <div className="mt-2 space-y-2">
            {comments.map((c) => (
              <CommentItem
                key={c._id}
                comment={c}
                currentUserId={currentUserId}
                onDeleteLocal={handleDeleteLocal}
                onReplyAdded={async () => {
                  // after reply added, we want to refresh top-level comments to get nested replies
                  await fetchComments(1, true);
                }}
              />
            ))}
          </div>
        )}

        <div ref={loaderRef} />

        {hasMore && comments.length > 0 && (
          <div className="py-4 text-center">
            <button
              className="px-4 py-2 rounded-full border border-border/20 text-sm text-subTextColor hover:bg-background/20"
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchComments(next, false);
              }}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
