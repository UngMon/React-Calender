import { create } from "zustand";
import { formatDate } from "@/utils/formatDate";
import { getInitialTimeRange } from "@/utils/formatTime";

export type PickerOrder = "start" | "end";
export type PickerDevice = "pc" | "mobile";

export type ActivePicker = {
  order: PickerOrder;
  device: PickerDevice;
} | null;

interface BasicState {
  activeDatePicker: ActivePicker;
  activeTimePicker: ActivePicker;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface TimeDateState extends BasicState {
  clickDate: (order: PickerOrder) => void;
  clickTime: (order: PickerOrder) => void;
  setTime: (order: string, timeStr: string) => void;
  setMiniDate: (order: "start" | "end" | string, date: string) => void;
  setInitialTimeAndDate: (
    value: Pick<BasicState, "startDate" | "endDate">,
  ) => void;
  onClose: () => void;
}

const initialState = {
  activeDatePicker: null,
  activeTimePicker: null,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
};

export const useTimeDateStore = create<TimeDateState>((set) => ({
  ...initialState,

  /* 캘린더 페이지에서 일정 생성시에 시작 날,시간 등 설정 */
  setInitialTimeAndDate: (data) =>
    set((state) => {
      const { startDate, endDate } = data;

      const { startTime: defaultStart, endTime: defaultEnd } =
        getInitialTimeRange();

      const startTime = state.startTime || defaultStart;
      const endTime = state.endTime || defaultEnd;

      return { startDate, endDate, startTime, endTime };
    }),

  /* DateBox 클릭 */
  clickDate: (order) =>
    set((state) => {
      const pickerDevice = window.innerWidth < 750 ? "mobile" : "pc";

      if (state.activeDatePicker?.order === order) {
        return { activeDatePicker: null };
      } else {
        // 시간 -> 날짜 클릭 날짜 state외에 나머지 모두 초기화 필요
        return {
          activeTimePicker: null,
          activeDatePicker: { order, device: pickerDevice },
        };
      }
    }),

  /* TimeBox 클릭 */
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

  onClose: () => set({ ...initialState }),

  /* 미니 캘린더에서 새로운 날짜 설정 */
  setMiniDate: (order, date) =>
    set((state) => {
      console.log("SETMiniDate");

      if (!state.startDate || !state.endDate) {
        // 날짜가 하나도 없을 때 첫 클릭 시 시간도 함께 세팅
        return order === "start" ? { startDate: date } : { endDate: date };
      }

      const currentStart = new Date(state.startDate);
      const currentEnd = new Date(state.endDate);
      const targetDate = new Date(date);

      // 기존 startDate와 endDate의 길이(일수) 차이 계산
      const diffTime = currentEnd.getTime() - currentStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (order === "start") {
        // startDate 변경
        if (targetDate <= currentEnd) {
          // date가 endDate보다 이전 날이거나 같으면 end 수정 X
          return { startDate: date };
        } else {
          // date가 endDate보다 뒷날이면 기존 길이 차이만큼 endDate도 뒤로 밀어줌
          // ex: diffDays가 0(같은 날)이면 endDate도 targetDate와 동일한 날짜가 됨

          const newEndDate = new Date(targetDate);
          newEndDate.setDate(newEndDate.getDate() + diffDays);

          return { startDate: date, endDate: formatDate(newEndDate) };
        }
      } else {
        // endDate 변경

        if (targetDate >= currentStart) {
          // date가 startDate보다 뒷날이거나 같으면 start 수정 X
          return { endDate: date };
        } else {
          // date가 startDate보다 이전 날이면 기존 길이 차이만큼 startDate도 앞으로 당겨줌
          const newStartDate = new Date(targetDate);
          newStartDate.setDate(newStartDate.getDate() - diffDays);
          return { startDate: formatDate(newStartDate), endDate: date };
        }
      }
    }),

  /* TimePicker에서 클릭하여 새로운 시간 설정 */
  setTime: (order, timeStr) => {
    set((state) => {
      const formattedTimeStr = timeStr
        .split(":")
        .map((s) => s.padStart(2, "0"))
        .join(":");

      if (order === "start") {
        // ----------------------------------------------------
        // 1. 시작 시간 변경 시 -> 기존 간격을 유지하며 종료일시 자동 계산
        // ----------------------------------------------------
        const currentStart = new Date(
          `${state.startDate}T${state.startTime || "00:00"}`,
        );
        const currentEnd = new Date(
          `${state.endDate}T${state.endTime || "00:00"}`,
        );

        // 날짜가 올바르지 않으면 시간만 업데이트 후 종료
        if (isNaN(currentStart.getTime()) || isNaN(currentEnd.getTime())) {
          return { startTime: formattedTimeStr };
        }

        // 기존 시간 차이(밀리초) 계산
        const diffMs = currentEnd.getTime() - currentStart.getTime();

        // 새로운 시작 일시 생성
        const newStartDateTime = new Date(
          `${state.startDate}T${formattedTimeStr}`,
        );

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

        return {
          startTime: timeStr,
          endDate: newEndDate,
          endTime: newEndTime,
        };
      } else {
        // ----------------------------------------------------
        // 2. 종료 시간 직접 변경 시 -> 자정(다음날) 판단 후 종료날짜 업데이트
        // ----------------------------------------------------

        const formattedStartTime = state.startTime
          .split(":")
          .map((s) => s.padStart(2, "0"))
          .join(":");

        // 선택한 종료 시간이 시작 시간보다 텍스트적으로 작다면
        if (formattedTimeStr < formattedStartTime) {
        console.log('<')
          // 시작 날짜의 기준 00:00 시각 생성
          const startZeroDate = new Date(`${state.startDate}T00:00:00`);
          // 하루 (24시간 = 86,400,000ms)를 더해서 정확한 다음 날 계산
          const nextDate = new Date(
            startZeroDate.getTime() + 24 * 60 * 60 * 1000,
          );

          const newEndDate = formatDate(nextDate);
          return {
            endDate: newEndDate,
            endTime: formattedTimeStr,
          };
        } else {
          console.log('>', formattedTimeStr)
          return {
            endTime: formattedTimeStr,
          };
        }
      }
    });
  },
}));
