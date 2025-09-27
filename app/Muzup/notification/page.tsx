import NotificationComponent from "@/components/notification/Notification";
import { sdk } from "@/utils/graphqlClient";
import { cookies } from "next/headers";
import React from "react";
import { AllNotification, UIUser } from "@/types/type";
import { User } from "@/generated/graphql";

// Map server response to AllNotification type
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

async function getAllNotifications() {
  try {
    const cookieStore = await cookies();

    const res = await sdk.getAllNotifications(
      {},
      { cookie: cookieStore.toString() }
    );
    if (res && res.getAllNotifications) {
      // Normalize each notification before returning
      const notifications = res.getAllNotifications.notifications.map(
        normalizeNotification
      );
      return {
        hasMore: res.getAllNotifications.hasMore,
        notifications,
      };
    }
  } catch (error) {
    return null;
  }
}

async function getMeUser() {
  try {
    const cookieStore = await cookies();

    const res = await sdk.meUser({}, { cookie: cookieStore.toString() });
    if (res && res.meUser) {
      return res.meUser;
    }
  } catch (error) {
    return null;
  }
}

async function Page() {
  const data = await getAllNotifications();
  const user = await getMeUser();
  console.log(user?.followings);
  console.log(user?.followers);
  return (
    <NotificationComponent
      hasMore={data?.hasMore ?? false}
      notification={data?.notifications ?? []}
      user={user as User}
    />
  );
}

export default Page;
