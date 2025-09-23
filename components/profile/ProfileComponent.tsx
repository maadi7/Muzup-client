"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  RequestStatus,
  User,
  UserPostInfo,
  UserProfileInfo,
} from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import {
  Heart,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Plus,
  Send,
  Minus,
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../common/Button";
import BlackButton from "../common/BlackButton";
import { useUser } from "@/store/user";

interface ProfileComponentProps {
  data: UserProfileInfo;
  id: string;
  meUserData?: User | null;
  requestStauts?: RequestStatus | null;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  data,
  id,
  meUserData,
  requestStauts,
}) => {
  const [posts, setPosts] = useState<UserPostInfo[]>(data.posts.posts || []);
  const [page, setPage] = useState<number>(data.posts.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(
    page < (data.posts.totalPages || 1)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [audioVolume, setAudioVolume] = useState<{ [key: string]: number }>({});
  const [audioDuration, setAudioDuration] = useState<{ [key: string]: number }>(
    {}
  );
  const [friendStatus, setFriendStatus] = useState<
    RequestStatus | null | undefined
  >(requestStauts);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { meUser, setMeUser } = useUser();

  /** Fetch next page */
  const fetchMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const res = await sdk.getUserProfileInfo({
        id: id,
        limit: 10,
        page: page + 1,
      });

      if (res?.getUserProfileInfo?.posts?.posts) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post._id));
          const newPosts = res.getUserProfileInfo.posts.posts.filter(
            (post) => !existingIds.has(post._id)
          );

          if (newPosts.length === 0) {
            console.log("No new posts to add (duplicates filtered)");
            return prev;
          }

          return [...prev, ...newPosts];
        });

        setPage(res.getUserProfileInfo.posts.page);
        setHasMore(
          res.getUserProfileInfo.posts.page <
            res.getUserProfileInfo.posts.totalPages
        );
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }, [id, hasMore, loading, page]); // Added missing dependencies

  /** Infinite scroll observer */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMorePosts();
        }
      },
      {
        rootMargin: "200px", // triggers earlier
        threshold: 0.1, // less strict
      }
    );

    const currentLoader = loaderRef.current;
    observer.observe(currentLoader);

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchMorePosts, hasMore, loading]);

  useEffect(() => {
    if (meUserData) {
      setMeUser(meUserData);
    }
  }, [meUserData]);

  // Audio player functions
  const handlePlayPause = (postId: string, audioUrl: string) => {
    const audio = audioRefs.current[postId];

    if (!audio) {
      const newAudio = new Audio(audioUrl);
      audioRefs.current[postId] = newAudio;

      newAudio.addEventListener("loadedmetadata", () => {
        setAudioDuration((prev) => ({ ...prev, [postId]: newAudio.duration }));
      });

      newAudio.addEventListener("timeupdate", () => {
        setAudioProgress((prev) => ({
          ...prev,
          [postId]: newAudio.currentTime,
        }));
      });

      newAudio.addEventListener("ended", () => {
        setPlayingAudio(null);
        setAudioProgress((prev) => ({ ...prev, [postId]: 0 }));
      });
    }

    if (playingAudio === postId) {
      audioRefs.current[postId].pause();
      setPlayingAudio(null);
    } else {
      // Pause other playing audio
      Object.keys(audioRefs.current).forEach((id) => {
        if (id !== postId) {
          audioRefs.current[id].pause();
        }
      });

      audioRefs.current[postId].play();
      setPlayingAudio(postId);
    }
  };

  const handleProgressChange = (postId: string, value: number) => {
    const audio = audioRefs.current[postId];
    if (audio) {
      audio.currentTime = value;
      setAudioProgress((prev) => ({ ...prev, [postId]: value }));
    }
  };

  const handleVolumeChange = (postId: string, value: number) => {
    const audio = audioRefs.current[postId];
    if (audio) {
      audio.volume = value;
      setAudioVolume((prev) => ({ ...prev, [postId]: value }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderPostContent = (post: UserPostInfo) => {
    if (!post.postUrl && !post.caption) {
      return null;
    }

    if (post.postUrl?.endsWith(".mp4")) {
      return (
        <div className="relative group">
          <video
            src={post.postUrl}
            controls
            className="w-full h-80 object-cover rounded-xl"
            style={{ backgroundColor: "#1a1a1a" }}
          />
        </div>
      );
    }

    if (post.postUrl && !post.postUrl.endsWith(".mp4")) {
      // Audio player with Spotify-like design
      const isPlaying = playingAudio === post._id;
      const progress = audioProgress[post._id] || 0;
      const duration = audioDuration[post._id] || 0;
      const volume = audioVolume[post._id] ?? 1;

      return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          {/* Audio Info Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">Audio Post</h4>
              <p className="text-gray-400 text-sm">@{data.username}</p>
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <span>{formatTime(progress)}</span>
              <div className="flex-1 relative">
                <div className="h-1 bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-100"
                    style={{
                      width: duration
                        ? `${(progress / duration) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={progress}
                  onChange={(e) =>
                    handleProgressChange(post._id, Number(e.target.value))
                  }
                  className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <SkipBack className="w-5 h-5 text-gray-300" />
              </button> */}

              <button
                onClick={() => handlePlayPause(post._id, post.postUrl!)}
                className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black ml-0.5" />
                ) : (
                  <Play className="w-6 h-6 text-black ml-1" />
                )}
              </button>

              {/* <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <SkipForward className="w-5 h-5 text-gray-300" />
              </button> */}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVolumeChange(post._id, volume > 0 ? 0 : 1)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <div className="w-20 relative">
                <div className="h-1 bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-gray-300 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) =>
                    handleVolumeChange(post._id, Number(e.target.value))
                  }
                  className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Text-only post
    if (post.caption && !post.postUrl) {
      return (
        <div className="bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 rounded-xl px-6 border border-gray-700/50">
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {data.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white leading-relaxed">{post.caption}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleChangeRequest = async () => {
    if (
      friendStatus === RequestStatus.Accepted ||
      friendStatus === RequestStatus.Pending
    ) {
      try {
        const data = await sdk.deleteRequest({ id: id });
        if (data.deleteRequest) {
          setFriendStatus(null);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      try {
        const rq = await sdk.sendRequest({ id: id });
        if (rq.sendRequest) {
          if (data.isPrivate) {
            setFriendStatus(RequestStatus.Pending);
          } else {
            setFriendStatus(RequestStatus.Accepted);
          }
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 font-secondary">
      {/* Enhanced Profile Header */}
      <div className="">
        {/* Background Gradient */}
        <div className=" inset-0 rounded-full" />

        <div className="relative flex flex-col md:flex-row w-full justify-between items-center gap-4 md:gap-0 md:items-start  bg-secondaryBg backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="rounded-full">
              <Image
                src={data.profilePic || "/default-avatar.png"}
                alt={data.username}
                width={100}
                height={100}
                className="rounded-full aspect-square object-contain border-4 border-gray-700"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2 font-primary">
                {data.username}
              </h1>
              <p className="text-gray-300 text-lg mb-3">
                {data.firstName} {data.lastName}
              </p>
              {data.bio && (
                <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
                  {data.bio}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="bg-gray-800 px-4 py-2 rounded-full">
                  <span className="text-white font-semibold">
                    {data.followersCount}
                  </span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-full">
                  <span className="text-white font-semibold">
                    {data.followingsCount}
                  </span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              text={
                friendStatus === RequestStatus.Accepted
                  ? "Unfollow"
                  : friendStatus === RequestStatus.Pending ||
                    friendStatus === RequestStatus.Rejected
                  ? "Pending"
                  : "follow"
              }
              primary
              Icon={friendStatus ? Minus : Plus}
              h="4"
              w="4"
              onClick={handleChangeRequest}
            />
            {friendStatus && (
              <BlackButton text="Chat" primary Icon={Send} h="4" w="4" />
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          Posts
          <div className="h-px bg-gradient-to-r from-green-500 to-transparent flex-1" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const content = renderPostContent(post);
            if (!content) return null;

            return (
              <div
                key={post._id}
                className=" bg-secondaryBg backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 flex flex-col"
              >
                <div className="p-6 flex-1">
                  {content}

                  {/* Caption for media posts */}
                  {post.caption && post.postUrl && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <p className="text-gray-300 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced Stats - Aligned to bottom end */}
                <div className="mt-auto p-6 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="text-xs text-gray-500">
                      {new Date(
                        post.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors group">
                        <Heart className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                        <span className="text-red-400 text-sm font-medium">
                          {post.reactionsCount}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors group">
                        <MessageCircle className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                        <span className="text-blue-400 text-sm font-medium">
                          {post.commentsCount}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Loader */}
      {hasMore && (
        <div ref={loaderRef} className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading more posts...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full">
            <span className="text-gray-400">✨ You've reached the end!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
