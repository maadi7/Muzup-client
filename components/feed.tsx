// components/feed.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { sdk } from "@/utils/graphqlClient";
import PostCard from "./post-card";

type Post = any; // use generated types if available

export default function Feed({ onRefetchSignal }: { onRefetchSignal?: number }) {
  const LIMIT = 10;
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(async (p = 1, replace = false) => {
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await sdk.getTimelinePosts({ page: p, limit: LIMIT } as any);
      const data = res?.getTimelinePosts ?? res; // support different sdk shapes
      if (!data) {
        if (p === 1) setPosts([]);
        setHasMore(false);
        return;
      }

      if (Array.isArray(data)) {
        if (replace) setPosts(data);
        else setPosts((prev) => (p === 1 ? data : [...prev, ...data]));
        setHasMore(data.length >= LIMIT);
      } else {
        // fallback if wrapped
        const arr = Array.isArray((data as any).items) ? (data as any).items : [];
        if (replace) setPosts(arr);
        else setPosts((prev) => (p === 1 ? arr : [...prev, ...arr]));
        setHasMore(arr.length >= LIMIT);
      }
    } catch (err) {
      console.error("fetch timeline posts error", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchPage(1, true);
    setPage(1);
  }, [fetchPage]);

  // react to parent signal to refetch newest (e.g. after createPost)
  useEffect(() => {
    if (typeof onRefetchSignal !== "undefined") {
      // reload newest first page
      fetchPage(1, true);
      setPage(1);
    }
  }, [onRefetchSignal, fetchPage]);

  // infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && hasMore && !loading) {
            const next = page + 1;
            setPage(next);
            fetchPage(next, false);
          }
        });
      },
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, page, loadingMore, hasMore, loading, fetchPage]);

  return (
    <div className="space-y-4">
      {loading && posts.length === 0 ? (
        <div className="rounded-lg border p-6 text-center" style={{ background: "var(--secondaryBg)", borderColor: "var(--sidebar-border)" }}>
          <div className="text-subTextColor">Loading feed...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border p-6 text-center" style={{ background: "var(--secondaryBg)", borderColor: "var(--sidebar-border)" }}>
          <div className="text-subTextColor">No posts yet — follow people or create a post</div>
        </div>
      ) : (
        posts.map((p: Post) => <PostCard key={p._id} post={p} />)
      )}

      <div ref={loaderRef} />

      {loadingMore && (
        <div className="text-center py-4 text-subTextColor">Loading more...</div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-subTextColor">You have reached the end</div>
      )}
    </div>
  );
}
