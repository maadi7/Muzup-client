// components/post-card-skeleton.tsx
"use client";

import React from "react";

export default function PostCardSkeleton() {
  return (
    <article
      className="rounded-2xl border backdrop-blur-sm shadow-lg animate-pulse"
      style={{
        background: "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
        borderColor: "var(--sidebar-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Profile Picture Skeleton */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-background/40 animate-shimmer"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background/40 rounded-full"></div>
          </div>

          {/* User Info Skeleton */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-2">
                <div className="h-4 bg-background/40 rounded-lg w-24 animate-shimmer"></div>
                <div className="h-3 bg-background/30 rounded-lg w-16 animate-shimmer"></div>
              </div>
              <div className="w-6 h-6 bg-background/30 rounded-full animate-shimmer"></div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-background/40 rounded-lg w-full animate-shimmer"></div>
              <div className="h-4 bg-background/40 rounded-lg w-4/5 animate-shimmer"></div>
              <div className="h-4 bg-background/40 rounded-lg w-2/3 animate-shimmer"></div>
            </div>

            {/* Media Skeleton (randomly show/hide for variety) */}
            {Math.random() > 0.4 && (
              <div className="mb-4 h-64 bg-background/30 rounded-2xl animate-shimmer"></div>
            )}

            {/* Reactions Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-1 px-3 py-2 rounded-full bg-background/30"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-4 h-4 bg-background/40 rounded animate-shimmer"></div>
                    <div className="w-3 h-3 bg-background/40 rounded animate-shimmer"></div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 bg-background/30 rounded-full animate-shimmer"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </article>
  );
}