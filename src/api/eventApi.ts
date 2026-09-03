import { supabase } from "@/auth/supabase";
import { CalendarEvent } from "@/type/events";

export const fetchEventsByMonth = async (
  userId: string,
  rangeStart: string,
  rangeEnd: string,
): Promise<CalendarEvent[]> => {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("uid", userId)
    .gte("end_date", rangeStart)
    .lte("start_date", rangeEnd);

  if (error) throw new Error(error.message);
  return data || [];
};

// 새 일정 저장 (Create)
export const createEventApi = async (
  newEvent: Omit<CalendarEvent, "id" | "isGhost">,
): Promise<CalendarEvent> => {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert([newEvent])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// 일정 수정 (Update)
export const updateEventApi = async (
  event: CalendarEvent,
): Promise<CalendarEvent> => {
  const { data, error } = await supabase
    .from("calendar_events")
    .update(event)
    .eq("id", event.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// 일정 삭제 (Delete)
export const deleteEventApi = async (eventId: string): Promise<void> => {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", eventId);
  if (error) throw new Error(error.message);
};
