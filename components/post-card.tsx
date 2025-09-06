// components/post-card.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { sdk } from "@/utils/graphqlClient";

type User = {
  _id: string;
  username?: string;
  profilePic?: string;
};

type Reaction = {
  emoji: string;
  users?: { _id: string; username?: string }[];
};

type PostType = {
  _id: string;
  caption?: string;
  postType?: string | null;
  postUrl?: string | null;
  waveUrl?: string | null;
  createdAt?: string;
  user?: User;
  reactions?: Reaction[];
  visibleTo?: User[];
};

export default function PostCard({
  post,
  currentUserId,
  onDelete,
}: {
  post: PostType;
  currentUserId?: string | null;
  onDelete?: (postId: string) => void;
}) {
  // local reactions state for optimistic updates
  const [localReactions, setLocalReactions] = useState<Reaction[]>(
    post.reactions ? JSON.parse(JSON.stringify(post.reactions)) : []
  );
  const [processingEmoji, setProcessingEmoji] = useState<Record<string, boolean>>({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);

  // menu / delete state
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);

  // helper: total reactions count
  const totalReactions = useMemo(
    () => localReactions.reduce((acc, r) => acc + (r.users?.length ?? 0), 0),
    [localReactions]
  );

  // check whether current user reacted with this emoji
  const userHasReacted = useCallback(
    (emoji: string) => {
      if (!currentUserId) return false;
      const r = localReactions.find((x) => x.emoji === emoji);
      return !!r?.users?.some((u) => u._id?.toString() === currentUserId?.toString());
    },
    [localReactions, currentUserId]
  );

  // convenience: emoji set to render (top 6 by count)
  const emojiList = useMemo(() => {
    const sorted = [...localReactions].sort((a, b) => (b.users?.length ?? 0) - (a.users?.length ?? 0));
    return sorted.slice(0, 6);
  }, [localReactions]);

  const handleToggleReaction = async (emoji: string) => {
    if (!currentUserId) {
      console.warn("no current user id available to react");
      return;
    }

    // Optimistic update
    const prev = JSON.parse(JSON.stringify(localReactions)) as Reaction[];
    const idx = prev.findIndex((r) => r.emoji === emoji);
    let updated = [...prev];

    const userObj = { _id: currentUserId, username: undefined };

    if (idx !== -1) {
      const has = updated[idx].users?.some((u) => u._id?.toString() === currentUserId?.toString());
      if (has) {
        updated[idx].users = updated[idx].users!.filter((u) => u._id?.toString() !== currentUserId?.toString());
        if (updated[idx].users.length === 0) updated.splice(idx, 1);
      } else {
        updated[idx].users!.push(userObj as any);
      }
    } else {
      updated.unshift({ emoji, users: [userObj as any] });
    }

    setLocalReactions(updated);
    setProcessingEmoji((s) => ({ ...s, [emoji]: true }));

    try {
      // Use original post.reactions to determine original state
      const originallyReacted = (post.reactions ?? []).some((r) =>
        r.emoji === emoji && r.users?.some((u) => u._id?.toString() === currentUserId?.toString())
      );

      if (originallyReacted) {
        await sdk.removeReaction({ postId: post._id, emoji } as any);
      } else {
        await sdk.addReaction({ postId: post._id, emoji } as any);
      }
    } catch (err) {
      console.error("reaction mutation failed, reverting", err);
      setLocalReactions(prev);
    } finally {
      setProcessingEmoji((s) => ({ ...s, [emoji]: false }));
    }
  };

  // Delete action
  const handleDelete = async () => {
    if (!post._id) return;
    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) return;

    setMenuError(null);
    setDeleting(true);

    try {
      await sdk.deletePost({ postId: post._id } as any);
      // notify parent that the post was deleted
      if (onDelete) onDelete(post._id);
    } catch (err: any) {
      console.error("delete post failed", err);
      setMenuError(err?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  const quickEmojis = ["👍", "❤️", "🔥", "😂", "🎉", "🎵"];
  const date = post.createdAt ? new Date(post.createdAt) : null;
  const timeAgo = date ? getTimeAgo(date) : "";

  return (
    <article
      className="group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(135deg, var(--secondaryBg) 0%, var(--background) 100%)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muzupColor to-blue-500 overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-muzupColor/20 transition-all">
              {post.user?.profilePic ? (
                <img src={post.user.profilePic} alt={post.user.username ?? "user"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {(post.user?.username ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-muzupColor rounded-full border-2 border-background"></div>
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-textColor hover:text-muzupColor cursor-pointer transition-colors">
                    {post.user?.username ?? "Unknown"}
                  </h4>
                  <div className="w-1 h-1 rounded-full bg-subTextColor/50"></div>
                  <span className="text-sm text-subTextColor">{timeAgo}</span>
                </div>
              </div>

              {/* Post Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((s) => !s)}
                  className="p-2 rounded-full hover:bg-background/50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Post menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-subTextColor">
                    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-background rounded-lg shadow-lg border border-border/10 z-50 p-2">
                    {/* Only show Delete if current user is post owner */}
                    {currentUserId && currentUserId === (post.user?._id as any) && (
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-background/30 transition-colors"
                      >
                        {deleting ? "Deleting..." : "Delete post"}
                      </button>
                    )}

                    {/* other actions could go here */}
                    <button
                      onClick={() => { navigator.clipboard?.writeText(window.location.href + `/post/${post._id}`); setMenuOpen(false)}}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-subTextColor hover:bg-background/30 transition-colors"
                    >
                      Copy link
                    </button>

                    {menuError && <div className="text-xs text-destructive px-3 pt-2">{menuError}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6">
        {post.caption && (
          <div className="mb-4 text-textColor leading-relaxed">
            <p className="whitespace-pre-wrap">{post.caption}</p>
          </div>
        )}

        {/* Media Content */}
        {post.postUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden bg-background/20">
            {post.postType?.toLowerCase?.() === "video" ? (
              <video src={post.postUrl} controls className="w-full max-h-[500px] object-cover" poster="" />
            ) : post.postType?.toLowerCase?.() === "audio" ? (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muzupColor to-blue-500 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-textColor">Audio Post</div>
                    <div className="text-sm text-subTextColor">Tap to play</div>
                  </div>
                </div>
                <audio src={post.postUrl} controls className="w-full" />
              </div>
            ) : (
              <div className="relative">
                {!imageLoaded && <div className="absolute inset-0 bg-background/20 animate-pulse rounded-2xl"></div>}
                <img
                  src={post.postUrl}
                  alt={post.caption ?? "post image"}
                  className="w-full object-cover transition-opacity duration-300"
                  onLoad={() => setImageLoaded(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reactions & Interactions */}
      <div className="px-6 pb-6">
        {/* Quick Reaction Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {quickEmojis.map((emoji) => {
              const count = localReactions.find((r) => r.emoji === emoji)?.users?.length ?? 0;
              const active = userHasReacted(emoji);
              const processing = processingEmoji[emoji];

              return (
                <button
                  key={emoji}
                  onClick={() => handleToggleReaction(emoji)}
                  disabled={processing}
                  className={`relative group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all transform hover:scale-105 ${
                    active ? "bg-muzupColor/15 text-muzupColor shadow-lg shadow-muzupColor/20" : "bg-background/40 text-subTextColor hover:bg-background/60 hover:text-textColor"
                  } ${processing ? "animate-pulse" : ""}`}
                >
                  <span className="text-lg">{emoji}</span>
                  {count > 0 && <span className={`text-xs font-medium ${active ? "text-muzupColor" : "text-subTextColor"}`}>{count}</span>}
                  <div className="absolute inset-0 rounded-full bg-muzupColor/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full hover:bg-background/50 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-subTextColor group-hover:text-textColor transition-colors">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <button className="p-2.5 rounded-full hover:bg-background/50 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-subTextColor group-hover:text-textColor transition-colors">
                <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button className="p-2.5 rounded-full hover:bg-background/50 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-subTextColor group-hover:text-textColor transition-colors">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.5" />
                <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reaction Summary */}
        {totalReactions > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowAllReactions(!showAllReactions)}
              className="flex items-center gap-2 text-sm text-subTextColor hover:text-textColor transition-colors"
            >
              <div className="flex items-center -space-x-1">
                {emojiList.slice(0, 3).map((reaction, i) => (
                  <div
                    key={reaction.emoji}
                    className="w-6 h-6 rounded-full bg-background border-2 border-secondaryBg flex items-center justify-center text-xs"
                    style={{ zIndex: 10 - i }}
                  >
                    {reaction.emoji}
                  </div>
                ))}
                {emojiList.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-background border-2 border-secondaryBg flex items-center justify-center text-xs text-subTextColor">
                    +{emojiList.length - 3}
                  </div>
                )}
              </div>

              <span>
                {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
              </span>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${showAllReactions ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showAllReactions && (
              <div className="mt-3 p-4 rounded-xl bg-background/30 space-y-2 animate-fadeIn">
                {emojiList.map((reaction) => (
                  <div key={reaction.emoji} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{reaction.emoji}</span>
                      <div className="flex items-center -space-x-2">
                        {reaction.users?.slice(0, 3).map((user, i) => (
                          <div
                            key={user._id}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-muzupColor to-blue-500 border-2 border-background flex items-center justify-center text-white text-xs font-medium"
                            style={{ zIndex: 10 - i }}
                          >
                            {(user.username ?? "U").charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-subTextColor">{reaction.users?.length ?? 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// Helper function for time formatting
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString();
}
