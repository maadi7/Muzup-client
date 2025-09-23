import { create } from "zustand";

interface FeedState {
  refetchSignal: number;
  incrementRefetchSignal: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  refetchSignal: 0,
  incrementRefetchSignal: () =>
    set((state) => ({ refetchSignal: state.refetchSignal + 1 })),
}));
