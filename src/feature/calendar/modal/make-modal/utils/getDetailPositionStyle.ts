// 레이아웃 고정 상수 분리
const MODAL_WIDTH = 500;
const HORIZONTAL_GAP = 10;
const VIEWPORT_PADDING = 16;

export const getDetailPositionStyle = (
  week: number,
  day: number,
  rect: DOMRect | null,
): React.CSSProperties => {
  if (!rect || week < 0 || day < 0 || typeof window === "undefined") {
    return {};
  }

  const { top, bottom, left, right } = rect;
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;

  // 1. X축 위치 계산하기
  // 작은 화면에서 centerX가 음수가 되어 모달 좌측이 잘리는 현상 방지
  const isLeftSide = day < 3;
  const centerX = Math.max(VIEWPORT_PADDING, (viewportWidth - MODAL_WIDTH) / 2);
  let VERTICAL_GAP = 24;

  let targetLeft: number;
  if (isLeftSide) {
    const nextRight = right + HORIZONTAL_GAP;
    // 우측 공간이 모달 너비 + 여백보다 부족하면 중앙 배치
    const isPossible =
      nextRight + MODAL_WIDTH + VIEWPORT_PADDING < viewportWidth;

    targetLeft = isPossible ? nextRight : centerX;
    if (isPossible) VERTICAL_GAP = 0;
  } else {
    const nextLeft = left - (MODAL_WIDTH + HORIZONTAL_GAP);
    // 좌측 공간이 부족하면 중앙 배치
    const isPossible = nextLeft > VIEWPORT_PADDING;
    targetLeft = isPossible ? nextLeft : centerX;
    if (isPossible) VERTICAL_GAP = 0;
  }

  // 2. Y축 위치 계산
  const isTopSide = week <= 2;

  const verticalStyle = isTopSide
    ? { top: top + VERTICAL_GAP, bottom: "auto" }
    : {
        top: "auto",
        bottom: Math.max(
          VIEWPORT_PADDING,
          viewportHeight - bottom + VERTICAL_GAP,
        ),
      };

  return { left: targetLeft, right: "auto", ...verticalStyle };
};
