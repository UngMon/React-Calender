export type PickerOrder = "start" | "end";
export type PickerDevice = "pc" | "mobile";

export type ActivePicker = {
  order: PickerOrder;
  device: PickerDevice;
} | null;