import { User } from "@/generated/graphql";
import { create } from "zustand";

type UserStore = {
  meUser: User | null;
  setMeUser: (value: User) => void;
};

export const useUser = create<UserStore>()((set) => ({
  meUser: null,
  setMeUser: (value: User) => set({ meUser: value }),
}));
