// components/user-store-initializer.tsx
"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export default function UserStoreInitializer({ user }: { user: any }) {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  return null;
}