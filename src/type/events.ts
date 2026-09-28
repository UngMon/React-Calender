export type ColorType =
  | "토마토"
  | "연분홍"
  | "바나나"
  | "세이지"
  | "바질"
  | "공작"
  | "블루베리"
  | "라벤더"
  | "포도"
  | "흑연";

export interface CalendarEvent {
  id: string; // 데이터 렌더링을 위한 고유 키
  uid: string;
  title: string; // 일정 내용 (content)
  text: string;
  start_date: string; // 'YYYY-MM-DD'
  end_date: string; // 'YYYY-MM-DD'
  color: ColorType;
  time_category: "allday" | "time"; // 종일 일정 여부
  start_time: string; // 'HH:mm' (24시간제, timeCategory가 'time'일 때만 존재)
  end_time: string; // 'HH:mm'
  created_at: string; // ISO String 형태
}

export interface GhostEvent extends CalendarEvent {
  isGhost: boolean;
}
