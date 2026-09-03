import { create } from "zustand";

interface DateType {
  open: string;
  setDate: (order: string) => void;
}

const initialState = {
  open: "",
};

export const useDateStore = create<DateType>((set) => ({
  ...initialState,

  setDate: (order) =>
    set((state) => {
      if (order === state.open) return { open: "" };
      else return { open: order };
    }),

  clearState: () => set(initialState),
}));

