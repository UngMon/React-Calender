export const getModalPositionStyle = (
  week: number,
  day: number,
): React.CSSProperties => {
  const isDesktop = window.innerWidth >= 1024 ? true : false;

  if (!isDesktop || week < 0 || day < 0) return {};

  // 1. X축 위치 계산하기
  const isLeftSide = day < 4; // 일요리(0) 부터 수요일 (3) 까지
  const horizontalStyle = isLeftSide
    ? {
        left: `calc((100% / 7) * ${day + 1} + 12px)`,
        right: "auto",
      }
    : {
        right: `calc((100% / 7) * ${7 - day} + 12px)`,
        left: "auto",
      };

  // 2. Y축 위치 계산: 상단 0, 1, 2주는 top 기준, 하단 3, 4, 5주는 bottom 기준
  let newWeek = week;

  if (week > 0 && week < 3) newWeek = week - 1.5;
  else if (week < 5 && week >= 3) newWeek = 4;

  const isTopSide = week < 3;
  const verticalStyle = isTopSide
    ? {
        // 상단 헤더 높이(예: 80px) + (달력 본문 6등분 비율 * week)
        top: `calc(136px + (100% - 80px) / 6 * ${newWeek})`,
        bottom: "auto",
      }
    : {
        // 하단 기준 여백
        bottom: `calc((100% - 80px) / 6 * (5 - ${newWeek}) + 30px)`,
        top: "auto",
      };

  return {
    ...horizontalStyle,
    ...verticalStyle,
  };
};
