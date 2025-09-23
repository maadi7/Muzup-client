import ProfileComponent from "@/components/profile/ProfileComponent";
import { User } from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { cookies } from "next/headers";
import React from "react";

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

async function fetchRequestStatus(id: string) {
  try {
    const cookieStore = await cookies();

    const res = await sdk.fetchFriendStatus(
      { id },
      { cookie: cookieStore.toString() }
    );
    if (res && res.fetchFriendStatus) {
      return res.fetchFriendStatus;
    }
  } catch (error) {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();

  const user = await sdk.getUserProfileInfo(
    { id: slug, limit: 10, page: 1 },
    { cookie: cookieStore.toString() }
  );

  const meUser = await getMeUser();

  const status = await fetchRequestStatus(slug);

  // Handle user not found
  if (!user) {
    return (
      <div className="text-subTextColor p-6">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p>The user could not be found.</p>
      </div>
    );
  }

  // Render user data
  return (
    <ProfileComponent
      meUserData={meUser as User}
      id={slug}
      data={user.getUserProfileInfo}
      requestStauts={status}
    />
  );
}
