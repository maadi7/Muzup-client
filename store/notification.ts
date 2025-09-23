import { create } from "zustand";

type NotificationStore = {
  notificationCount: number;
  setNotificationCount: (value: number) => void;
};

export const useNotificationCount = create<NotificationStore>()((set) => ({
  notificationCount: 0,
  setNotificationCount: (value: number) => set({ notificationCount: value }),
}));
