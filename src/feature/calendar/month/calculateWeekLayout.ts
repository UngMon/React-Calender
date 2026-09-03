import { EventsWithPosition } from "./renderdWeeks";

export interface DailyLayoutResult {
  dailyLimits: number[];
  overflowCounts: number[];
  visibleEvents: EventsWithPosition[];
}

export const calculateWeekLayout = (
  eventsWithPosition: EventsWithPosition[],
  MAX_VISIBLE_SLOTS: number,
): DailyLayoutResult => {
  // console.log('calculateWeekLayout')

  if (MAX_VISIBLE_SLOTS <= 0) {
    return {
      dailyLimits: Array(7).fill(0),
      overflowCounts: Array(7).fill(0),
      visibleEvents: [],
    };
  }

  // 1. 각 요일별로 '+ 더보기' 버튼이 필요한지 여부만 먼저 추적한다. (기본값: false)
  const needsMoreButton = Array(7).fill(0);

  // 2. 무조건 셀(날짜) 밖으로 밀려나는 일정(MAX를 초과)을 가진 날짜는 더보기 버튼 확정
  eventsWithPosition.forEach((evt) => {
    if (evt.slot >= MAX_VISIBLE_SLOTS) {
      for (let d = evt.startIdx; d <= evt.endIdx; d++) {
        needsMoreButton[d] = true;
      }
    }
  });

  // 3. 연쇄 작용: 딱 '경계선(MAX_VISIBLE_SLOTS)'에 있는 일정만 주목한다.
  // 이 일정들이 '더보기 버튼이 켜진 날짜(요일)'을 지나간다면, 그 일정(긴 일정임)은 전체가 숨겨져야한다. <= 무한루프로 연쇄작용 해주기
  const borderEvents = eventsWithPosition.filter(
    (evt) => evt.slot === MAX_VISIBLE_SLOTS - 1,
  );

  let changed = true;
  while (changed) {
    changed = false;
    borderEvents.forEach((evt) => {
      // 해당 경계선 일정이 지나는 날짜 중 하나라도 '더보기 버튼'이 필요하다면?
      // 즉 긴 일정이 더보기 버튼이 필요한 날짜를 지나간다면?
      let isAffected = false;
      for (let d = evt.startIdx; d <= evt.endIdx; d++) {
        if (needsMoreButton[d]) {
          isAffected = true;
          break;
        }
      }

      // 따라서 일정을 숨겨야하므로, 이 일정이 지나는 '모든 날짜'에 더보기 버튼을 켠다.
      if (isAffected) {
        for (let d = evt.startIdx; d <= evt.endIdx; d++) {
          if (!needsMoreButton[d]) {
            needsMoreButton[d] = true;
            changed = true;
          }
        }
      }
    });
  }

  // 4. 결정된 버튼 유무를 바탕으로 요일별 최종 한도(Limit) 결정
  // 버튼이 필요하면 한 칸을 비워야 하므로 MAX - 1, 아니면 MAX
  const dailyLimits = needsMoreButton.map((needsBtn) =>
    needsBtn ? MAX_VISIBLE_SLOTS - 1 : MAX_VISIBLE_SLOTS,
  );

  // 5. 화면에 렌더링할 일정 필터링 (최종 한도를 넘지 않는 것만 통과)
  const visibleEvents = eventsWithPosition.filter((evt) => {
    for (let d = evt.startIdx; d <= evt.endIdx; d++) {
      if (evt.slot >= dailyLimits[d]) return false;
    }
    return true;
  });

  // 6. 각 요일별 숨겨진 일정(더보기) 개수 계산하기
  const overflowCounts = Array(7).fill(0);
  eventsWithPosition.forEach((evt) => {
    // 화면에 렌더링되지 않은 일정이라면, 그 일정이 지나는 날짜의 숨김 카운트 +1
    if (!visibleEvents.includes(evt)) {
      for (let d = evt.startIdx; d <= evt.endIdx; d++) {
        overflowCounts[d]++;
      }
    }
  });

  return { dailyLimits, overflowCounts, visibleEvents };
};
