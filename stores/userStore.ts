import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);