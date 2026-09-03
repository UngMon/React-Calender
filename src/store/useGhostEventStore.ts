import { create } from "zustand";
import { formatDate } from "@/utils/formatDate";
import { getInitialTimeRange } from "@/utils/formatTime";
import { GhostEvent } from "@/type/events";

const event: GhostEvent = {
  id: "ghost-evt-1",
  title: "제목 없음",
  text: "",
  color: "블루베리",
  start_date: "",
  end_date: "",
  time_category: "allday",
  start_time: getInitialTimeRange().startTime,
  end_time: getInitialTimeRange().endTime,
  isGhost: true,
  created_at: new Date().toISOString(),
};

interface EventStoreState {
  ghostEvent: GhostEvent | null;
  setGhostEvent: (startDate: string, endDate: string) => void;
  setMoveDate: (order: string, dateStr: string) => void;
  cancelGhostEvent: () => void;
}

const initialState = { ghostEvent: null };

// 스토어 생성
export const useGhostEventStore = create<EventStoreState>((set) => ({
  ...initialState,

  setGhostEvent: (start_date, end_date) =>
    set(() => {
      return { ghostEvent: { ...event, start_date, end_date } };
    }),

  setMoveDate: (order, dateStr) =>
    set((state) => {
      if (!state.ghostEvent) return state;

      const newEvent = { ...state.ghostEvent };

      const currentStart = new Date(state.ghostEvent.start_date);
      const currentEnd = new Date(state.ghostEvent.end_date);
      const targetDate = new Date(dateStr);

      const diffTime = currentEnd.getTime() - currentStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (order === "start") {
        // 시작날을 변경
        if (targetDate > currentEnd) {
          // date가 endDate보다 뒷날이면 기존 길이 차이만큼 endDate도 뒤로 밀어줌
          // ex: diffDays가 0(같은 날)이면 endDate도 targetDate와 동일한 날짜가 됨
          // 종료 날짜를 처음 기간처럼 간격을 생성
          const newEndDate = new Date(dateStr);
          newEndDate.setDate(newEndDate.getDate() + diffDays);
          newEvent.end_date = formatDate(newEndDate);
        }

        newEvent.start_date = dateStr;
      } else {
        // 종료 날짜를 변경
        if (targetDate < currentStart) {
          // 선택한 종료 날짜가 startDate보다 이전 날이면 기존 길이 간격만큼 startDate도 앞으로 당겨줌
          const newStartDate = new Date(dateStr);
          newStartDate.setDate(newStartDate.getDate() - diffDays);
          newEvent.start_date = formatDate(newStartDate);
        }

        newEvent.end_date = dateStr;
      }
      return { ghostEvent: newEvent };
    }),

  cancelGhostEvent: () => set(initialState),
}));
