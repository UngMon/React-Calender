import { create } from "zustand";
import { formatDate } from "@/utils/formatDate";
import { getInitialTimeRange } from "@/utils/formatTime";
import { CalendarEvent, GhostEvent, ColorType } from "@/type/events";
import { useAuthStore } from "./useAuthStore";

const calculateShiftedDates = (
  currentStartDate: string,
  currentEndDate: string,
  order: "start" | "end" | string,
  targetDateStr: string,
) => {
  const currentStart = new Date(currentStartDate);
  const currentEnd = new Date(currentEndDate);
  const targetDate = new Date(targetDateStr);

  const diffTime = currentEnd.getTime() - currentStart.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let newStartDate = currentStartDate;
  let newEndDate = currentEndDate;

  if (order === "start") {
    // 시작날을 변경
    if (targetDate > currentEnd) {
      // date가 endDate보다 뒷날이면 기존 길이 차이만큼 endDate도 뒤로 밀어줌
      // ex: diffDays가 0(같은 날)이면 endDate도 targetDate와 동일한 날짜가 됨
      // 종료 날짜를 처음 기간처럼 간격을 생성
      const adjustedEnd = new Date(targetDateStr);
      adjustedEnd.setDate(adjustedEnd.getDate() + diffDays);
      newEndDate = formatDate(adjustedEnd);
    }
    newStartDate = targetDateStr;
  } else {
    // 종료 날짜를 변경
    if (targetDate < currentStart) {
      // 선택한 종료 날짜가 startDate보다 이전 날이면 기존 길이 간격만큼 startDate도 앞으로 당겨줌
      // const adjustedStart = new Date(targetDateStr);
      // adjustedStart.setDate(adjustedStart.getDate() - diffDays);
      // newStartDate = formatDate(adjustedStart);

      // 선택한 종료 날짜가 startDate보다 이전 날이면 startDate도 endDate와 같은 날로 변경
      newStartDate = targetDateStr;
    }
    newEndDate = targetDateStr;
  }

  return { start_date: newStartDate, end_date: newEndDate };
};

const calculateShiftedTimes = (
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  order: "start" | "end" | string,
  targetTimeStr: string,
) => {
  const formattedTimeStr = targetTimeStr
    .split(":")
    .map((s) => s.padStart(2, "0"))
    .join(":");

  let newStartTime = startTime;
  let newEndTime = endTime;
  let newEndDate = endDate;

  if (order === "start") {
    // 1. 시작 시간 변경 시: 기존 간격을 유지하며 종료시간 및 종료일 자동 계산
    const currentStart = new Date(`${startDate}T${startTime || "00:00"}`);
    const currentEnd = new Date(`${endDate}T${endTime || "00:00"}`);

    if (isNaN(currentStart.getTime()) || isNaN(currentEnd.getTime())) {
      return {
        start_time: formattedTimeStr,
        end_time: endTime,
        end_date: endDate,
      };
    }

    const diffMs = currentEnd.getTime() - currentStart.getTime();
    const newStartDateTime = new Date(`${startDate}T${formattedTimeStr}`);
    const newEndDateTime = new Date(newStartDateTime.getTime() + diffMs);

    newStartTime = formattedTimeStr;
    newEndDate = formatDate(newEndDateTime);

    const newEndHour = String(newEndDateTime.getHours()).padStart(2, "0");
    const newEndMinute = String(newEndDateTime.getMinutes()).padStart(2, "0");
    newEndTime = `${newEndHour}:${newEndMinute}`;
  } else {
    // 2. 종료 시간 변경 시: 시작 시간보다 앞설 경우 다음 날로 종료일 연장
    const formattedStartTime = (startTime || "00:00")
      .split(":")
      .map((s) => s.padStart(2, "0"))
      .join(":");

    if (formattedTimeStr < formattedStartTime) {
      const startZeroDate = new Date(`${startDate}T00:00:00`);
      const nextDate = new Date(startZeroDate.getTime() + 24 * 60 * 60 * 1000);
      newEndDate = formatDate(nextDate);
    }

    newEndTime = formattedTimeStr;
  }

  return {
    start_time: newStartTime,
    end_time: newEndTime,
    end_date: newEndDate,
  };
};

const event: Omit<
  GhostEvent,
  "uid" | "start_date" | "end_date" | "start_time" | "end_time"
> = {
  id: "ghost-evt-1",
  title: "제목 없음",
  text: "",
  color: "블루베리",
  time_category: "allday",
  isGhost: true,
  created_at: new Date().toISOString(),
};

export interface OpenPikcer {
  category: string; // "date" | "time" | "";
  order: string; //"start" | "end" | "";
  device: string; // "pc" | "mo" | ""
}

interface EventStoreState {
  ghostEvent: GhostEvent | null;
  editEvent: CalendarEvent | null;
  openPicker: OpenPikcer;
  setGhostEvent: (startDate: string, endDate: string) => void;
  setEditEvent: (pickedEvent: CalendarEvent) => void;
  setOpenPicker: (category: "date" | "time", order: "start" | "end") => void;
  clearOpenPicker: () => void;
  setMoveDate: (order: string, dateStr: string, category: string) => void;
  setTime: (order: string, timeStr: string, category: string) => void;
  setIsAllday: (isAllday: "allday" | "time", category: "make" | "edit") => void;
  setEventColor: (color: ColorType, category: "make" | "edit") => void;
  onClear: () => void;
}

const initialPicker: OpenPikcer = {
  category: "",
  order: "",
  device: "",
};

const initialState = {
  ghostEvent: null,
  editEvent: null,
  openPicker: initialPicker,
};

// 스토어 생성
export const useGhostEventStore = create<EventStoreState>((set) => ({
  ...initialState,

  // 임시 일정 생성
  setGhostEvent: (start_date, end_date) =>
    set(() => {
      const uid = useAuthStore.getState().uid;
      if (!uid) return {};

      /* 캘린더 페이지에서 일정 생성시에 시작 날,시간 등 설정 */
      const { startTime: defaultStart, endTime: defaultEnd } =
        getInitialTimeRange();

      const start_time = defaultStart;
      const end_time = defaultEnd;

      return {
        ghostEvent: {
          ...event,
          uid,
          start_date,
          end_date,
          start_time,
          end_time,
        },
      };
    }),

  // 수정 페이지 상태 업데이트
  setEditEvent: (event_data) => set({ editEvent: event_data }),

  // 날짜, 시간 picker 클릭 on/off
  setOpenPicker: (category, order) =>
    set((state) => {
      const device = window.innerWidth >= 750 ? "pc" : "mo";
      const current = state.openPicker;

      const isSamePicker =
        current.device === device &&
        current.category === category &&
        current.order === order;

      if (isSamePicker) {
        return {
          openPicker: {
            ...current,
            device: "", // 패널만 닫고 내부 콘텐츠는 유지
          },
        };
      }

      return {
        openPicker: {
          category,
          order,
          device,
        },
      };
    }),

  // openPicker 초기화
  clearOpenPicker: () => set({ openPicker: { ...initialPicker } }),

  // 날짜 변경
  setMoveDate: (order, dateStr, category) =>
    set((state) => {
      // 1. make 모드일 때: ghostEvent만 다룸 (타입 확실)
      if (category === "make") {
        if (!state.ghostEvent) return state;
        const { start_date, end_date } = calculateShiftedDates(
          state.ghostEvent.start_date,
          state.ghostEvent.end_date,
          order,
          dateStr,
        );

        return {
          ghostEvent: {
            ...state.ghostEvent,
            start_date,
            end_date,
          },
        };
      }

      // 2. edit 모드일 때: editEvent만 다룸 (타입 확실)
      if (category === "edit") {
        if (!state.editEvent) return state;
        const { start_date, end_date } = calculateShiftedDates(
          state.editEvent.start_date,
          state.editEvent.end_date,
          order,
          dateStr,
        );

        return {
          editEvent: {
            ...state.editEvent,
            start_date,
            end_date,
          },
        };
      }

      return state;
    }),

  // 시간 변경 Time 다이얼 or 박스를 클릭하여 새로운 시간 설정
  setTime: (order, timeStr, category) =>
    set((state) => {
      // 일정 생성 order = make => ghostEvent 갱신
      if (category === "make") {
        if (!state.ghostEvent) return state;

        const { start_time, end_time, end_date } = calculateShiftedTimes(
          state.ghostEvent.start_date,
          state.ghostEvent.end_date,
          state.ghostEvent.start_time,
          state.ghostEvent.end_time,
          order,
          timeStr,
        );

        return {
          ghostEvent: {
            ...state.ghostEvent,
            start_time,
            end_time,
            end_date,
          },
        };
      }

      if (category === "edit") {
        // 일정 수정: editEvent 갱신
        if (!state.editEvent) return state;

        const { start_time, end_time, end_date } = calculateShiftedTimes(
          state.editEvent.start_date,
          state.editEvent.end_date,
          state.editEvent.start_time,
          state.editEvent.end_time,
          order,
          timeStr,
        );

        return {
          editEvent: {
            ...state.editEvent,
            start_time,
            end_time,
            end_date,
          },
        };
      }

      return state;
    }),

  // 시간대 설정 (하루 종일 or 시간)
  setIsAllday: (isAllday, category) =>
    set((state) => {
      if (category === "make") {
        if (!state.ghostEvent) return state;
        return { ghostEvent: { ...state.ghostEvent, time_category: isAllday } };
      }
      if (category === "edit") {
        if (!state.editEvent) return state;
        return { editEvent: { ...state.editEvent, time_category: isAllday } };
      }
      return state;
    }),

  // 컬러 변경하기
  setEventColor: (color, category) =>
    set((state) => {
      console.log("??????????", color, category);
      if (category === "make") {
        if (!state.ghostEvent) return state;
        return { ghostEvent: { ...state.ghostEvent, color } };
      }
      if (category === "edit") {
        if (!state.editEvent) return state;
        return { editEvent: { ...state.editEvent, color } };
      }
      return state;
    }),

  // 초기화
  onClear: () => set(initialState),
}));
