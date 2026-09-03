import { create } from "zustand";

interface ModalBasicState {
  week: number;
  day: number;
  open: boolean;
  // width: number;
  // height: number;
}

interface ModalState extends ModalBasicState {
  setPosition: (value: Pick<ModalBasicState, "week" | "day">) => void;
  clearPosition: () => void;
}

const initialState = {
  week: -1,
  day: -1,
  open: false,
  // width: 0,
  // height: 0,
};

export const useModalStore = create<ModalState>((set) => ({
  ...initialState,

  // --- 액션 (Actions) ---
  setPosition: (data) =>
    set(() => {
      const { week, day } = data;

      return {
        week,
        day,
        open: true,
      };
    }),

  clearPosition: () => {
    console.log("clearPosition");
    set({ ...initialState });
  },
}));
