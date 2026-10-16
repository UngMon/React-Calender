import { EventsWithPosition } from "@/feature/calendar/month/renderdWeeks";
import { create } from "zustand";

interface ModalBasicState {
  week: number;
  day: number;
  rect: DOMRect | null;
  openModal: string;
  event_data: EventsWithPosition | null;
}

interface ModalState extends ModalBasicState {
  setPosition: (
    value: Pick<ModalBasicState, "week" | "day" | "rect">,
    event_data: EventsWithPosition | null,
    type: "make" | "detail",
  ) => void;
  clearPosition: () => void;
}

const initialState = {
  week: -1,
  day: -1,
  rect: null,
  openModal: "",
  event_data: null,
};

export const useModalStore = create<ModalState>((set) => ({
  ...initialState,

  // --- 액션 (Actions) ---
  setPosition: (data, event_data, type) =>
    set({ ...data, event_data, openModal: type }),

  clearPosition: () => {
    set({ ...initialState });
  },
}));
