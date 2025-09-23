"use client";

import { User } from "@/generated/graphql";
import { useUser } from "@/store/user";
import { useEffect } from "react";

export default function UserStoreInitializer({
  user,
}: {
  user: User | null | undefined;
}) {
  const { meUser, setMeUser } = useUser();

  useEffect(() => {
    if (user) {
      setMeUser(user);
    }
  }, [user, setMeUser]);

  return null;
}
