import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventApi,
  deleteEventApi,
  fetchEventsByMonth,
  updateEventApi,
} from "@/api/eventApi";
import { useAuthStore } from "@/store/useAuthStore";
import { CalendarEvent } from "@/type/events";

interface Props {
  rangeStart?: string;
  rangeEnd?: string;
}

type NewEventPayload = Omit<CalendarEvent, "id" | "uid" | "isGhost">;

export const QUERY_KEY_EVENTS = "calendar_events";

export const useCalendarEvents = ({ rangeStart, rangeEnd }: Props = {}) => {
  const queryClient = useQueryClient();
  const uid = useAuthStore((state) => state.uid);

  const withAuth = <T, R>(action: (uid: string, payload: T) => Promise<R>) => {
    return async (payload: T): Promise<R> => {
      if (!uid)
        throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      return action(uid, payload);
    };
  };

  // READ: 일정 가져오기 및 캐싱
  const eventsQuery = useQuery({
    queryKey: [QUERY_KEY_EVENTS, uid, rangeStart, rangeEnd],
    queryFn: () => fetchEventsByMonth(uid!, rangeStart!, rangeEnd!),
    enabled: Boolean(uid && rangeStart && rangeEnd),
  });

  // CREATE: 일정 DB 저장
  const createMutation = useMutation({
    mutationFn: withAuth((uid, eventData: NewEventPayload) =>
      createEventApi({ ...eventData, uid }),
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_EVENTS] }); // Query 업데이트 캐시 무효화
    },
    onError: (err) => {
      alert("일정 저장 실패: " + err.message);
    },
  });

  // UPDATE: 일정 수정
  const updateMutation = useMutation({
    mutationFn: updateEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_EVENTS] });
    },
    onError: (err: Error) => {
      console.error("일정 수정 실패:", err);
      alert("일정을 수정하지 못했습니다: " + err.message);
    },
  });

  // DELETE: 일정 삭제
  const deleteMutation = useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_EVENTS] });
    },
    onError: (err: Error) => {
      console.error("일정 삭제 실패:", err);
      alert("일정을 삭제하지 못했습니다: " + err.message);
    },
  });

  return {
    serverEvents: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    createEvent: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEvent: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteEvent: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
