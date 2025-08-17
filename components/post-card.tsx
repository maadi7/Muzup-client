// components/post-card.tsx
"use client";

import React from "react";

type User = {
  _id: string;
  username?: string;
  profilePic?: string;
};

type Reaction = {
  emoji: string;
  users?: { _id: string; username?: string }[];
};

type Post = {
  _id: string;
  caption?: string;
  postType?: string | null;
  postUrl?: string | null;
  waveUrl?: string | null;
  createdAt?: string;
  user?: User;
  reactions?: Reaction[];
};

export default function PostCard({ post }: { post: Post }) {
  const date = post.createdAt ? new Date(post.createdAt) : null;
  return (
    <article
      className="rounded-lg border p-4 space-y-3"
      style={{
        background: "var(--secondaryBg)",
        borderColor: "var(--sidebar-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-background overflow-hidden flex-shrink-0">
          {post.user?.profilePic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.user.profilePic} alt={post.user.username ?? "user"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-subTextColor">{(post.user?.username ?? "U").charAt(0).toUpperCase()}</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-textColor font-medium">{post.user?.username ?? "Unknown"}</div>
              <div className="text-xs text-subTextColor">{date ? date.toLocaleString() : ""}</div>
            </div>
          </div>

          <div className="mt-3 text-textColor">
            {post.caption && <p className="whitespace-pre-wrap">{post.caption}</p>}
          </div>

          {post.postUrl && (
            <div className="mt-3">
              {post.postType?.toLowerCase?.() === "video" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <video src={post.postUrl} controls className="w-full max-h-[420px] object-cover rounded" />
              ) : post.postType?.toLowerCase?.() === "audio" ? (
                <audio src={post.postUrl} controls className="w-full" />
              ) : (
                // image by default
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.postUrl} alt={post.caption ?? "post image"} className="w-full object-cover rounded" />
              )}
            </div>
          )}

          {/* reactions */}
          <div className="mt-3 flex items-center gap-4 text-sm text-subTextColor">
            <div className="flex items-center gap-1">
              <span className="text-xs">💬</span>
              <span>{post.reactions?.reduce((acc, r) => acc + (r.users?.length ?? 0), 0) ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              {post.reactions?.slice(0, 5).map((r) => (
                <button key={r.emoji} className="px-2 py-1 rounded-md bg-background/50 hover:bg-accent/5 transition text-subTextColor">
                  {r.emoji} {r.users?.length ?? 0}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </article>
  );
}
