import { create } from "zustand";
import { formatDate } from "@/utils/formatDate";
import { getInitialTimeRange } from "@/utils/formatTime";
import { useGhostEventStore } from "./useGhostEventStore";

export type PickerOrder = "start" | "end";
export type PickerDevice = "pc" | "mobile";

export type ActivePicker = {
  order: PickerOrder;
  device: PickerDevice;
} | null;

interface BasicState {
  activeTimePicker: ActivePicker;
  start_time: string;
  end_time: string;
}

export interface TimeState extends BasicState {
  clickTime: (order: PickerOrder) => void;
  setTime: (order: string, timeStr: string) => void;
  setInitialTime: () => void;
  onClose: () => void;
}

const initialState = {
  activeTimePicker: null,
  start_time: "",
  end_time: "",
};

export const useTimeStore = create<TimeState>((set) => ({
  ...initialState,

  /* 캘린더 페이지에서 일정 생성시에 시작 날,시간 등 설정 */
  setInitialTime: () =>
    set((state) => {
      const { startTime: defaultStart, endTime: defaultEnd } =
        getInitialTimeRange();

      const start_time = state.start_time || defaultStart;
      const end_time = state.end_time || defaultEnd;

      return { start_time, end_time };
    }),

  /* TimePicker 클릭 */
  clickTime: (order) =>
    set((state) => {
      const pickerDevice = window.innerWidth < 750 ? "mobile" : "pc";

      if (state.activeTimePicker?.order === order) {
        return { activeTimePicker: null };
      } else {
        // 날짜 -> 시간 클릭 시간 state외에 나머지 모두 초기화 필요
        return {
          activeDatePicker: null,
          activeTimePicker: { order, device: pickerDevice },
        };
      }
    }),

  /* Time 다이얼 or 박스를 클릭하여 새로운 시간 설정 */
  setTime: (order, timeStr) => {
    set((state) => {
      const { ghostEvent, setMoveDate } = useGhostEventStore.getState();
      const start_date = ghostEvent?.start_date;
      const end_date = ghostEvent?.end_date;

      const formattedTimeStr = timeStr
        .split(":")
        .map((s) => s.padStart(2, "0"))
        .join(":");

      if (order === "start") {
        // ----------------------------------------------------
        // 1. 시작 시간 변경 시 -> 기존 간격을 유지하며 종료일시 자동 계산
        // ----------------------------------------------------
        const currentStart = new Date(
          `${start_date}T${state.start_time || "00:00"}`,
        );
        const currentEnd = new Date(`${end_date}T${state.end_time || "00:00"}`);

        // 날짜가 올바르지 않으면 시간만 업데이트 후 종료
        if (isNaN(currentStart.getTime()) || isNaN(currentEnd.getTime())) {
          return { start_time: formattedTimeStr };
        }

        // 기존 시간 차이(밀리초) 계산
        const diffMs = currentEnd.getTime() - currentStart.getTime();

        // 새로운 시작 일시 생성
        const newStartDateTime = new Date(`${start_date}T${formattedTimeStr}`);

        // 새로운 시작 일시에 기존 시간 차이를 더해 새로운 종료 일시 생성
        const newEndDateTime = new Date(newStartDateTime.getTime() + diffMs);

        // 계산된 종료 일시에서 날짜와 시간 추출
        const newEndDate = formatDate(newEndDateTime);
        const newEndHour = String(newEndDateTime.getHours()).padStart(2, "0");
        const newEndMinute = String(newEndDateTime.getMinutes()).padStart(
          2,
          "0",
        );
        const newEndTime = `${newEndHour}:${newEndMinute}`;

        // 시간 차이로 기존의 종료 날짜를 벗어날 때, 날짜 변경해주기
        if (end_date !== newEndDate) setMoveDate("end", newEndDate);

        return {
          start_time: timeStr,
          end_time: newEndTime,
        };
      } else {
        // ----------------------------------------------------
        // 2. 종료 시간 직접 변경 시 -> 자정(다음날) 판단 후 종료날짜 업데이트
        // ----------------------------------------------------

        const formattedStartTime = state.start_time
          .split(":")
          .map((s) => s.padStart(2, "0"))
          .join(":");

        // 종료 시간이 시작 시간보다 앞선 경우 -> 다음 날로 계산하여 GhostStore 업데이트
        if (formattedTimeStr < formattedStartTime) {
          // 시작 날짜의 기준 00:00 시각 생성
          const startZeroDate = new Date(`${start_date}T00:00:00`);
          // 하루 (24시간 = 86,400,000ms)를 더해서 정확한 다음 날 계산하기
          const nextDate = new Date(
            startZeroDate.getTime() + 24 * 60 * 60 * 1000,
          );
          const newEndDate = formatDate(nextDate);
          setMoveDate("end", newEndDate);
        }

        return {
          end_time: formattedTimeStr,
        };
      }
    });
  },

  onClose: () => set({ activeTimePicker: null }),

  onClear: () => set({ ...initialState }),
}));
