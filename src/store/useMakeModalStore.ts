import { create } from "zustand";

interface ModalBasicState {
  week: number;
  day: number;
  openMakeModal: boolean;
}

interface MakeModalState extends ModalBasicState {
  setPosition: (value: Pick<ModalBasicState, "week" | "day">) => void;
  clearPosition: () => void;
}

const initialState = {
  week: -1,
  day: -1,
  openMakeModal: false,
};

export const useMakeModalStore = create<MakeModalState>((set) => ({
  ...initialState,

  // --- 액션 (Actions) ---
  setPosition: (data) =>
    set(() => {
      return {
        week: data.week,
        day: data.day,
        openMakeModal: true,
      };
    }),

  clearPosition: () => {
    console.log("clearPosition");
    set({ ...initialState });
  },
}));
