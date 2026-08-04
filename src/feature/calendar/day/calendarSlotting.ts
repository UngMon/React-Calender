import { CalendarEvent } from "../mockData";

export interface TimeEvent {
  id: string;
  title: string;
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  color: string;
  startDate: string;
  timeCategory: "time" | "allday";
}

export interface SlottedEvent extends TimeEvent {
  startMin: number;
  endMin: number;
  colIdx: number;
  maxCols: number;
}

// 겹치는 일정들을 N등분으로 슬롯팅하는 순수 알고리즘
export const calculateDailySlots = (
  events: CalendarEvent[],
  targetDate: string,
): SlottedEvent[] => {
  // 1. 타겟 날짜의 시간 지정 일정만 필터링 및 분(Min) 파싱
  const timeEvents = events
    .filter(
      (ev) =>
        ev.timeCategory === "time" &&
        ev.startDate <= targetDate &&
        ev.endDate >= targetDate,
    )
    .map((ev) => {
      const [sh, sm] = ev.startTime!.split(":").map(Number);
      const [eh, em] = ev.endTime!.split(":").map(Number);

      const startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;

      if (endMin - startMin < 30) endMin = sh * 60 + sm + 30;

      return {
        ...ev,
        startMin,
        endMin,
        colIdx: 0,
        maxCols: 1,
      };
    });

  // 2. 시작 시간 기준 오름차순 정렬 (O(N log N))
  timeEvents.sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);

  const result: SlottedEvent[] = [];
  let currentCluster: SlottedEvent[] = [];
  let clusterMaxEnd = 0;

  // 내부 헬퍼 함수: 모인 그룹(Cluster)을 기둥(Column)에 배정하고 방출
  const flushCluster = () => {
    if (currentCluster.length === 0) return;

    const columnsEndTimes: number[] = [];

    currentCluster.forEach((ev) => {
      // 들어갈 수 있는 가장 빠른 기둥(빈자리) 찾기
      const availableColIdx = columnsEndTimes.findIndex(
        (end) => end <= ev.startMin,
      );

      if (availableColIdx !== -1) {
        ev.colIdx = availableColIdx;
        columnsEndTimes[availableColIdx] = ev.endMin; // 빈자리 갱신
      } else {
        ev.colIdx = columnsEndTimes.length; // 새 기둥 생성
        columnsEndTimes.push(ev.endMin);
      }
    });

    const maxCols = columnsEndTimes.length;
    currentCluster.forEach((ev) => {
      ev.maxCols = maxCols; // 렌더링 시 N등분 계산을 위해 그룹의 총 기둥 수 기록
      result.push(ev);
    });

    currentCluster = [];
    clusterMaxEnd = 0;
  };

  // 3. 순회하며 클러스터링 처리 (O(N))
  timeEvents.forEach((ev) => {
    if (currentCluster.length > 0 && ev.startMin >= clusterMaxEnd) {
      flushCluster();
    }
    currentCluster.push(ev);
    clusterMaxEnd = Math.max(clusterMaxEnd, ev.endMin);
  });

  flushCluster(); // 마지막 남은 그룹 방출

  return result;
};
