import { create } from "zustand";

interface ModalBasicState {
  week: number;
  day: number;
  width: number;
  height: number;
  open: boolean;
}

interface ModalState extends ModalBasicState {
  setPosition: (
    value: Pick<ModalBasicState, "week" | "day" | "width" | "height">,
  ) => void;
  clearPosition: () => void;
}

const initialState = {
  week: -1,
  day: -1,
  width: 0,
  height: 0,
  open: false,
};

export const useModalStore = create<ModalState>((set) => ({
  ...initialState,

  // --- 액션 (Actions) ---
  setPosition: (data) =>
    set(() => {
      const { week, day, width, height } = data;

      return {
        week,
        day,
        width,
        height,
        open: true,
      };
    }),

  clearPosition: () => {
    console.log("clearPosition");
    set({ ...initialState });
  },
}));
