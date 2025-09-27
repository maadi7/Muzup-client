"use client";
import { sdk } from "@/utils/graphqlClient";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, UserPlus, Heart, MessageCircle } from "lucide-react";
import { AllNotification, UIUser } from "@/types/type";
import { NotificationType, User } from "@/generated/graphql";
import Link from "next/link";
import { useNotificationCount } from "@/store/notification";
import moment from "moment";
import { useUser } from "@/store/user";
import Button from "../common/Button";

interface NotificationProps {
  notification: AllNotification[];
  hasMore: boolean;
  user: User | null;
}

// Normalize API notification to AllNotification
const normalizeNotification = (n: any): AllNotification => {
  const mapUser = (user: any): UIUser => ({
    _id: user._id || "unknown-id", // fallback if API doesn't send _id
    username: user.username ?? "Unknown",
    profilePic: user.profilePic ?? null,
  });

  return {
    _id: n._id,
    type: n.type,
    text: n.text ?? null,
    isRead: n.isRead,
    isArchived: n.isArchived ?? false,
    entityType: n.entityType,
    entityId: n.entityId ?? null,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    sender: mapUser(n.sender),
    receiver: mapUser(n.receiver),
    metadata: n.metadata,
  };
};

const NotificationComponent: React.FC<NotificationProps> = ({
  notification,
  hasMore: initialHasMore,
  user,
}) => {
  const [notiData, setNotiData] = useState<AllNotification[]>(
    (notification || []).map(normalizeNotification)
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [loading, setLoading] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { notificationCount, setNotificationCount } = useNotificationCount();
  const { meUser, setMeUser } = useUser();

  useEffect(() => {
    if (user) {
      setMeUser(user);
    }
  }, [user]);

  useEffect(() => {
    const markAllasRead = async () => {
      setNotificationCount(0);
      try {
        await sdk.markAllRead();
      } catch (error) {
        console.log(error);
      }
    };
    markAllasRead();
  }, []);

  const fetchMoreNotifications = useCallback(async () => {
    if (!hasMore || loading) return;
    try {
      setLoading(true);
      const res = await sdk.getAllNotifications({
        limit: 10,
        page: page + 1,
      });

      if (res?.getAllNotifications?.notifications) {
        const normalized = res.getAllNotifications.notifications.map(
          normalizeNotification
        );
        setNotiData((prev) => [...prev, ...normalized]);
        setPage((prev) => prev + 1);
        setHasMore(res.getAllNotifications.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreNotifications();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchMoreNotifications, hasMore, loading]);

  const handleAccept = async (id: string) => {
    try {
      const data = await sdk.acceptRequest({ id });
      if (data.acceptRequest && meUser) {
        setMeUser({
          ...meUser,
          followers: [...(meUser.followers || []), id],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotification = (noti: AllNotification) => {
    let Icon = Bell;
    let actionText = noti.text || "";

    switch (noti.type) {
      case NotificationType.Follow:
        Icon = UserPlus;
        actionText = !meUser?.followers?.includes(noti.sender._id)
          ? `${noti.sender.username} requested to follow you`
          : `${noti.sender.username} started following you`;
        break;
      case NotificationType.PostLike:
        Icon = Heart;
        actionText = `${noti.sender.username} liked your post`;
        break;
      case NotificationType.CommentReply:
        Icon = MessageCircle;
        actionText = `${noti.sender.username} commented on your post`;
        break;
      default:
        break;
    }

    return (
      <div
        key={noti._id}
        className={`flex items-center font-secondary gap-4 p-4 rounded-xl border border-gray-700/50 bg-secondaryBg hover:bg-gray-800/50 transition-all ${
          !noti.isRead ? "border-green-500/50" : ""
        }`}
      >
        <Link href={`/Muzup/user/${noti.sender._id}`}>
          <Image
            src={noti.sender.profilePic || "/default-avatar.png"}
            alt={noti.sender.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <p className="text-gray-200 text-sm">{actionText}</p>
          <span className="text-gray-500 text-xs">
            {moment(noti.createdAt).fromNow()}
          </span>
        </div>
        {!meUser?.followers?.includes(noti.sender._id) &&
        noti.type === NotificationType.Follow ? (
          <div className="">
            <Button
              text="Accept"
              primary
              onClick={() => handleAccept(noti.sender._id)}
              Icon={UserPlus}
              h="4"
              w="4"
            />
          </div>
        ) : (
          <Icon className="w-5 h-5 text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl px-4 pb-8">
      <h2 className="text-2xl font-bold text-white mb-6 font-primary">
        Notifications
      </h2>
      <div className="flex flex-col gap-4">
        {notiData.length > 0 ? (
          notiData.map(renderNotification)
        ) : (
          <p className="text-gray-400 text-center font-primary">
            No notifications yet
          </p>
        )}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
