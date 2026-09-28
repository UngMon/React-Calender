import { EventsWithPosition } from "@/feature/calendar/month/renderdWeeks";
import { create } from "zustand";

interface DetailModalState {
  openDetailModal: boolean;
  week: number;
  day: number;
  rect: DOMRect | null;
  event: EventsWithPosition | null;
  setPosition: (
    week: number,
    day: number,
    event: EventsWithPosition,
    rect: DOMRect,
  ) => void;
  onClose: () => void;
}

const initialState = {
  openDetailModal: false,
  week: -1,
  day: -1,
  rect: null,
  event: null,
};

export const useDetailModalStore = create<DetailModalState>((set) => ({
  ...initialState,

  setPosition: (week, day, event, rect) =>
    set(() => {
      return { openDetailModal: true, week, day, event, rect };
    }),

  onClose: () => set({ ...initialState }),
}));
