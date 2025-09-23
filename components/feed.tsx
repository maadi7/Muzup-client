// components/feed.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { sdk } from "@/utils/graphqlClient";
import PostCard from "./post-card";
import PostCardSkeleton from "./post-card-skeleton";

type Post = any;

export default function Feed({
  onRefetchSignal,
}: {
  onRefetchSignal?: number;
}) {
  const LIMIT = 1;
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Record<string, boolean>>({});

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await sdk.meUser();
      const user = res?.meUser ?? null;
      setCurrentUserId(user?._id ?? null);
    } catch (err) {
      console.warn("failed to fetch current user", err);
      setCurrentUserId(null);
    }
  }, []);

  const fetchPage = useCallback(async (p = 1, replace = false) => {
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await sdk.getTimelinePosts({ page: p, limit: LIMIT } as any);
      const data = res?.getTimelinePosts ?? res;

      if (!data || (Array.isArray(data) && data.length === 0)) {
        if (p === 1) setPosts([]);
        setHasMore(false);
        return;
      }

      if (Array.isArray(data)) {
        if (replace) setPosts(data);
        else setPosts((prev) => (p === 1 ? data : [...prev, ...data]));
        setHasMore(data.length >= LIMIT);
      } else {
        const arr = Array.isArray((data as any).items)
          ? (data as any).items
          : [];
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

  // initial load + fetch current user
  useEffect(() => {
    fetchCurrentUser();
    fetchPage(1, true);
    setPage(1);
  }, [fetchCurrentUser, fetchPage]);

  // react to parent signal to refetch newest (e.g. after createPost)
  useEffect(() => {
    if (typeof onRefetchSignal !== undefined) {
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
    <div className="space-y-6">
      {loading && posts.length === 0 ? (
        // Enhanced skeleton loading with staggered animation
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              className="animate-fadeIn"
            >
              <PostCardSkeleton />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center relative overflow-hidden backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
            borderColor: "var(--sidebar-border)",
          }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-muzupColor animate-pulse"></div>
            <div
              className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-blue-500 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-purple-500 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M8 12h8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-textColor mb-2">
              Your feed is empty
            </h3>
            <p className="text-subTextColor max-w-sm mx-auto">
              Start following people or create your first post to see content
              here
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2.5 bg-muzupColor text-white rounded-full font-medium hover:bg-muzupColor/90 transition-all hover:scale-105 transform">
                Find People
              </button>
              <button className="px-6 py-2.5 border border-muzupColor/20 text-muzupColor rounded-full font-medium hover:bg-muzupColor/10 transition-all">
                Explore Posts
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((p: Post, index) => {
            const isRemoving = !!removingIds[p._id];

            return (
              <div
                key={p._id}
                className={`transform transition-all duration-300 ${
                  isRemoving
                    ? "opacity-0 -translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <PostCard
                  post={p}
                  currentUserId={currentUserId}
                  onDelete={(id: string) => {
                    // start removal animation
                    setRemovingIds((s) => ({ ...s, [id]: true }));
                    // remove from posts after animation duration (300ms)
                    setTimeout(() => {
                      setPosts((prev) => prev.filter((x) => x._id !== id));
                      // cleanup removing flag
                      setRemovingIds((s) => {
                        const next = { ...s };
                        delete next[id];
                        return next;
                      });
                    }, 300);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div ref={loaderRef} />

      {loadingMore && (
        <div className="space-y-4 py-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              className="animate-fadeIn"
            >
              <PostCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 border border-border/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-subTextColor/50"></div>
            <span className="text-subTextColor font-medium">
              You've reached the end
            </span>
            <div className="w-2 h-2 rounded-full bg-subTextColor/50"></div>
          </div>
        </div>
      )}
    </div>
  );
}
