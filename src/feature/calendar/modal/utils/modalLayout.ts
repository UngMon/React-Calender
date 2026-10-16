export type ModalCategory = "make" | "detail";

export interface Position {
  x: number;
  y: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface ModalLayout extends Position {
  height: number;
}

export const DEFAULT_MAKE_MODAL_HEIGHT = 570;
export const DEFAULT_DEATIL_MODAL_HEIGHT = 240;
export const DESKTOP_MIN_WIDTH = 750;

const MODAL_WIDTH = 450;
const MIN_MODAL_HEIGHT = 200;
const MODAL_GAP = 32;
const HORIZONTAL_GAP = 10;
const VIEWPORT_PADDING = 16;
const EVENT_HEIGHT = 24;

// 카테고리별 기본 모달 높이
export function getDefaultHeight(cateogry: "make" | "detail") {
  return cateogry === "make"
    ? DEFAULT_MAKE_MODAL_HEIGHT
    : DEFAULT_DEATIL_MODAL_HEIGHT;
}

// 모달의 X 위치 최대 값
export function getMaxModalX(
  viewportWidth: number,
  modalWidth: number,
): number {
  return Math.max(MODAL_GAP, viewportWidth - modalWidth - MODAL_GAP);
}

// 모달의 Y 위치 최대 값
export function getMaxModalY(
  viewportHeight: number,
  modalHeight: number,
): number {
  return Math.max(MODAL_GAP, viewportHeight - modalHeight - MODAL_GAP);
}

// min <= max인 범위 안으로 값을 제한하는 함수 (모달의 위치, 높이등의 제한)
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// 드래그 or 뷰포트 높이에 따른 모달의 높이 계산
function calculateHeight(
  y: number,
  viewportHeight: number,
  DEFAULT_HEIGHT: number,
): number {
  const availableHeight = viewportHeight - y - MODAL_GAP;
  return clamp(availableHeight, MIN_MODAL_HEIGHT, DEFAULT_HEIGHT);
}

interface InitialPositionOptions {
  category: ModalCategory;
  week: number;
  day: number;
  rect: Pick<DOMRect, "top" | "left" | "right" | "height"> | null;
  viewport: Viewport | null;
}

// 달력 셀(td)클릭 시에 모달의 초기 위치 계산하기
export function calculateInitialPosition({
  category,
  week,
  day,
  rect,
  viewport,
}: InitialPositionOptions): Position {
  if (week < 0 || day < 0 || !rect || !viewport) {
    return { x: 0, y: 0 };
  }

  const { top, left, right, height: cellHeight } = rect;
  const { width, height } = viewport;

  // 모달 X축 중앙 맞춤
  const centerX = Math.max(VIEWPORT_PADDING, (width - MODAL_WIDTH) / 2);

  // 카테고리별 기본 모달의 높이
  const DEFAULT_MODAL_HEIGHT = getDefaultHeight(category);

  // 모달 Y축 중앙 맞춤
  const centerY = Math.max(
    VIEWPORT_PADDING,
    (height - DEFAULT_MODAL_HEIGHT) / 2,
  );

  // 일~수요일은(day: 0 ~ 3) 날짜 칸 오른쪽, 목~토요일(day: 4 ~ 6)은 왼쪽을 우선한다
  const nextX =
    day < 4 ? right + HORIZONTAL_GAP : left - MODAL_WIDTH - HORIZONTAL_GAP;

  // 뷰포트 너비를 넘어가는지 확인하기.. 넘어가면 중앙 맞춤
  const fitsX =
    day < 4
      ? nextX + MODAL_WIDTH + VIEWPORT_PADDING < width
      : nextX > VIEWPORT_PADDING;

  // 셀의 top을 기준으로 모달 Y축 계산하기
  const nextY =
    category === "make"
      ? week < 3
        ? top - week * (cellHeight / 2)
        : top - DEFAULT_MAKE_MODAL_HEIGHT + (6 - week) * (cellHeight / 2)
      : week < 3 // cateogry = 'detail'
        ? top
        : top - DEFAULT_DEATIL_MODAL_HEIGHT;

  const fitsY =
    week < 3
      ? nextY + DEFAULT_MODAL_HEIGHT + VIEWPORT_PADDING < height
      : nextY > VIEWPORT_PADDING;

  return {
    x: fitsX ? nextX : centerX,
    y: fitsY ? nextY : centerY,
  };
}

interface DragLayoutOptions {
  category: ModalCategory;
  position: Position;
  maxX: number;
  viewportHeight: number;
}

// 드래그: 원하는 위치로 이동하고,
// 그 위치의 남은 공간에 맞춰 높이를 줄임
export function calculateDragLayout({
  category,
  position,
  maxX,
  viewportHeight,
}: DragLayoutOptions): ModalLayout {
  // 모달이 가질 수 있는 최대 Y거리 계산 (32px ~ )
  const maxY = getMaxModalY(viewportHeight, MIN_MODAL_HEIGHT);

  // 실제 뷰포트 높이에 맞는 적절한 모달의 Y축 반환
  const y = clamp(position.y, MODAL_GAP, maxY);

  const DEFAULT_HEIGHT = getDefaultHeight(category);

  return {
    x: clamp(position.x, MODAL_GAP, Math.max(MODAL_GAP, maxX)),
    y,
    height: calculateHeight(y, viewportHeight, DEFAULT_HEIGHT),
  };
}

interface ResizeLayoutOptions {
  category: ModalCategory;
  position: Position;
  modalWidth: number;
  modalHeight: number;
  viewport: Viewport;
}

// 화면 크기 변경: 기본 높이를 확보하도록 모달을 먼저 위로 옮기고,
// 그래도 공간이 부족하면 모달의 높이를 줄인다.
export function calculateResizeLayout({
  category,
  position,
  modalWidth,
  modalHeight,
  viewport,
}: ResizeLayoutOptions): ModalLayout | null {
  // 모달 높이가 200px 이하는 실행x
  if (viewport.height < MIN_MODAL_HEIGHT) return null;

  // 현재 위치를 가능한 한 유지
  // 최소 높이와 아래 여백을 확보할 수 없을 때만 위로 옮김
  const maxY = getMaxModalY(viewport.height, modalHeight);
  const y = clamp(position.y, MODAL_GAP, maxY);
  const DEFAULT_HEIGHT = getDefaultHeight(category);

  return {
    x: clamp(position.x, MODAL_GAP, getMaxModalX(viewport.width, modalWidth)),
    y,
    height: calculateHeight(y, viewport.height, DEFAULT_HEIGHT),
  };
}
