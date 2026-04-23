// types/calendar.ts (예시 스키마 타입)
export interface CalendarEvent {
  id: string; // 데이터 렌더링을 위한 고유 키
  title: string; // 일정 내용 (content)
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  monthList: string[]; // ['YYYY-MM', ...] 파이어스토어 array-contains 쿼리용 필드!
  color:
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
  timeCategory: "allday" | "time"; // 종일 일정 여부
  startTime?: string; // 'HH:mm' (24시간제, timeCategory가 'time'일 때만 존재)
  endTime?: string; // 'HH:mm'
  createdAt: string; // ISO String 형태
}

// mockData.ts
export const mockEvents: CalendarEvent[] = [
  {
    // 케이스 1: 3월에서 4월로 넘어가는 '긴 종일 일정' (Spanning)
    id: "evt-001",
    title: "도쿄 출장 및 휴가 ✈️",
    startDate: "2026-04-08",
    endDate: "2026-04-11",
    monthList: ["2026-03", "2026-04"], // 3월 달력, 4월 달력 모두에서 불러와짐
    color: "블루베리",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 1: 3월에서 4월로 넘어가는 '긴 종일 일정' (Spanning)
    id: "evt-001",
    title: "도쿄 출장 및 휴가 ✈️ 1",
    startDate: "2026-04-08",
    endDate: "2026-04-09",
    monthList: ["2026-03", "2026-04"], // 3월 달력, 4월 달력 모두에서 불러와짐
    color: "바나나",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 1: 3월에서 4월로 넘어가는 '긴 종일 일정' (Spanning)
    id: "evt-001",
    title: "도쿄 출장 및 휴가 ✈️ 2",
    startDate: "2026-04-09",
    endDate: "2026-04-10",
    monthList: ["2026-03", "2026-04"], // 3월 달력, 4월 달력 모두에서 불러와짐
    color: "토마토",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
    {
    // 케이스 1: 3월에서 4월로 넘어가는 '긴 종일 일정' (Spanning)
    id: "evt-001",
    title: "도쿄 출장 및 휴가 ✈️ 3",
    startDate: "2026-04-10",
    endDate: "2026-04-11",
    monthList: ["2026-03", "2026-04"], // 3월 달력, 4월 달력 모두에서 불러와짐
    color: "바질",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 2: 4월 내의 당일 '시간 지정' 일정
    id: "evt-002",
    title: "프론트엔드 팀 주간 회의",
    startDate: "2026-04-10",
    endDate: "2026-04-10",
    monthList: ["2026-04"],
    color: "바나나",
    timeCategory: "time",
    startTime: "14:00", // UI 렌더링 시 '오후 02:00'로 포맷팅
    endTime: "15:30",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 3: 4월 당일 '종일' 일정
    id: "evt-003",
    title: "종합 건강검진 🏥",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    monthList: ["2026-04"],
    color: "토마토",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 4: 4월 내의 'n박 n일' 일정
    id: "evt-004",
    title: "제주도 워크샵 🌴",
    startDate: "2026-04-20",
    endDate: "2026-04-22",
    monthList: ["2026-04"],
    color: "바질",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 5: 심야/새벽에 걸친 시간 일정 (당일)
    id: "evt-005",
    title: "서버 점검 및 DB 마이그레이션",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    monthList: ["2026-04"],
    color: "흑연",
    timeCategory: "time",
    startTime: "02:00", // 오전 2시
    endTime: "05:00", // 오전 5시
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 6: 4월에서 5월로 넘어가는 긴 일정
    id: "evt-006",
    title: "React Native 앱 배포 주간 🚀",
    startDate: "2026-04-28",
    endDate: "2026-05-02",
    monthList: ["2026-04", "2026-05"],
    color: "포도",
    timeCategory: "allday",
    createdAt: new Date().toISOString(),
  },
  {
    // 케이스 7: 5월 일정
    id: "evt-007",
    title: "어린이날 가족 모임",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    monthList: ["2026-05"],
    color: "연분홍",
    timeCategory: "time",
    startTime: "12:00", // 오후 12시
    endTime: "18:00", // 오후 6시
    createdAt: new Date().toISOString(),
  },
];
