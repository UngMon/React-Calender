import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import {
  calculateDragLayout,
  calculateInitialPosition,
  calculateResizeLayout,
  DESKTOP_MIN_WIDTH,
  getDefaultHeight,
  getMaxModalX,
  ModalCategory,
  type ModalLayout,
} from "../utils/modalLayout";

// 커스텀 훅이 받을 인자
interface Options {
  category: ModalCategory;
  modalRef: RefObject<HTMLDivElement | null>;
  week: number;
  day: number;
  rect: DOMRect | null;
  onDragStart?: () => void;
}

// 드래그 시작 시 저장하는 정보의 타입
// 시작 좌표를 기준으로 이동 거리를 계산하여 클릭한 순간 모달이 다른 위치로 튀는 것을 막음
interface DragStart {
  pointerId: number; // 드래그를 시작한 포인터의 식별 번호
  handle: HTMLElement; // 캡처한 헤더 DOM 요소이며, 종료 시 캡처를 해제할 때 사용
  clientX: number; // 시작 마우스 X 좌표, 브라우저 화면 왼쪽을 기준으로 측정
  clientY: number; // 시작 마우스 Y 좌표, 브라우저 화면 위쪽을 기준으로 측정
  x: number; // 시작 모달의 실제 왼쪽 위치, 마우스 이동 거리를 더할 기준값
  y: number; // 시작 모달의 실제 위쪽 위치, 마우스 이동 거리를 더할 기준값
  maxX: number; // 오른쪽에 32px을 남길 수 있는 최대 x 좌표임
  hasMoved: boolean; // 이동 처리 여부, 시작점으로 돌아와 놓는 동작과 단순 클릭을 구분
}

export const useModalEventLayout = ({
  category,
  modalRef,
  week,
  day,
  rect,
  onDragStart,
}: Options) => {
  // null이면 초기 자동 배치를 사용
  // 위치와 높이는 함께 바뀌므로 하나의 상태로 관리.
  const [layout, setLayout] = useState<ModalLayout | null>(null);

  // 시작 좌표와 캡처한 헤더를 저장하며, null이면 진행 중인 드래그가 없음을 의미
  // 화면에 직접 표시하지 않는 정보이므로 변경 시 렌더링을 요청하지 않는 useRef를 사용
  const dragRef = useRef<DragStart | null>(null);

  // requestAnimationFrame 예약 ID이며, 예약 취소와 중복 예약 방지에 사용함
  // null이면 예약이 없음을 의미하며, 예약 ID가 0일 수도 있어 null로 구분함
  const frameIdRef = useRef<number | null>(null);

  // 다음 화면 갱신에 반영할 최신 모달 위치
  // 여러 이동 이벤트가 들어와도 최신 좌표만 덮어써 두고 예약한 프레임에서 한 번 반영함
  const pendingLayoutRef = useRef<ModalLayout | null>(null);

  // 셀(td)클릭 시 모달의 초기 위치 or layout에 저장된 위치 x, y
  const { x, y } =
    layout ??
    calculateInitialPosition({
      category,
      week,
      day,
      rect,
      viewport:
        typeof window === "undefined"
          ? null
          : {
              width: window.innerWidth,
              height: window.innerHeight,
            },
    });

  const cancelPendingFrame = useCallback(() => {
    // 아직 실행되지 않은 화면 갱신 예약을 취소하는 함수
    // 종료 후 남아 있는 콜백이 실행되지 않도록 하고, 새로운 예약을 받을 수 있게 ID를 비움
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  // 예약된 최신 위치와 높이를 화면에 반영하는 함수
  const applyPendingLayout = useCallback(() => {
    const pending = pendingLayoutRef.current;
    if (!pending) return;

    pendingLayoutRef.current = null;
    setLayout(pending);
  }, []);

  // 앱의 드래그 정보와 브라우저의 포인터 캡처를 정리하는 함수
  // 마우스가 헤더 밖으로 이동할 때가 아니라 버튼을 놓거나 드래그를 취소할 때 호출함
  const releaseDrag = useCallback(() => {
    // ref를 비운 뒤에도 헤더와 포인터 ID를 사용할 수 있도록 지역 변수에 보관함
    const drag = dragRef.current;

    // 캡처 해제로 lostpointercapture가 발생해도 같은 드래그를 다시 정리하지 않도록 먼저 비움
    dragRef.current = null;

    // drag가 null이면 뒤쪽 접근을 멈추며, hasPointerCapture는 헤더의 캡처 여부를 반환
    if (drag?.handle.hasPointerCapture(drag.pointerId)) {
      drag.handle.releasePointerCapture(drag.pointerId);
    }
  }, []);

  // 마우스 버튼을 놓거나 입력이 중단됐을 때 사용하는 공통 종료 처리
  // 마지막 위치를 반영한 뒤 드래그 정보와 캡처를 정리하며, 모달 위치를 원래대로 되돌리지는 않음
  const finishDrag = useCallback(() => {
    cancelPendingFrame();

    // 다음 프레임 전에 버튼을 놓아도 마지막 위치는 반영합니다.
    applyPendingLayout();
    releaseDrag();
  }, [cancelPendingFrame, applyPendingLayout, releaseDrag]);

  useLayoutEffect(() => {
    const handleResize = () => {
      // 모달 창의 너비, 높이 등의 정보 가져오기
      const bounds = modalRef.current?.getBoundingClientRect();
      if (!bounds) return;

      // 모달창의 높이를 뷰포트 or 드래그에 따라 변경하기
      const nextLayout = calculateResizeLayout({
        category,
        position: { x, y },
        modalWidth: bounds.width,
        modalHeight: bounds.height,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });

      if (nextLayout) setLayout(nextLayout);
    };

    // 처음 열렸을 때도 현재 화면에 맞춰 위치와 높이를 보정
    if (layout === null) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef, x, y, layout]);

  useEffect(() => {
    // 창 포커스 상실(알트 탭으로 다른 앱으로 전환)과 컴포넌트 제거 시 드래그 관련 작업을 정리함
    // 다른 앱으로 전환하는 등 페이지 창이 포커스를 잃으면 종료 이벤트를 놓칠 수 있어 드래그를 끝냄
    window.addEventListener("blur", finishDrag);

    // 모달이 제거되거나 의존성이 변경되면 등록한 리스너와 남아 있는 예약 및 캡처를 정리
    return () => {
      window.removeEventListener("blur", finishDrag);
      cancelPendingFrame();
      pendingLayoutRef.current = null;

      // 제거 중에는 상태를 갱신하지 않고 작업 정보만 정리
      releaseDrag();
    };
  }, [finishDrag, cancelPendingFrame, releaseDrag]);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    // 헤더에서 좌클릭하면 시작 좌표를 저장하고 포인터 캡처를 설정
    if (
      !e.isPrimary ||
      e.button !== 0 ||
      window.innerWidth < DESKTOP_MIN_WIDTH ||
      dragRef.current ||
      !modalRef.current // 모달 DOM이 연결되지 않았다면 실제 위치를 읽을 수 없어 시작하지 않음
    ) {
      return;
    }

    e.preventDefault();

    //실제 위치를 읽어 드래그 시작 시 모달이 다른 위치로 튀는 것을 막음
    const bounds = modalRef.current.getBoundingClientRect();

    // 마우스가 헤더 밖으로 나가도 이 포인터의 move/up 이벤트를 헤더가 계속 받도록 설정
    // setPointerCapture는 이벤트 전달 대상을 지정하는 기능, 시작할 때 한 번만 호출
    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      pointerId: e.pointerId,
      handle: e.currentTarget,
      clientX: e.clientX,
      clientY: e.clientY,
      x: bounds.left,
      y: bounds.top,
      maxX: getMaxModalX(window.innerWidth, bounds.width),
      hasMoved: false,
    };

    onDragStart?.();
  };

  // 현재 마우스 좌표로 다음 모달 위치를 계산하여 저장하는 함수
  const updateDragPosition = (clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    // 시작점으로 돌아와 버튼을 놓는 경우에도 마지막 좌표를 계산하도록 이동 처리 여부를 남김
    drag.hasMoved = true;

    // 새 위치 = 시작 모달 위치 + (현재 마우스 위치 - 시작 마우스 위치)
    // Math.max로 최소 32, Math.min으로 최대 이동 한계 안에 좌표를 제한함
    pendingLayoutRef.current = calculateDragLayout({
      category,
      position: {
        x: drag.x + clientX - drag.clientX,
        y: drag.y + clientY - drag.clientY,
      },
      maxX: drag.maxX,
      viewportHeight: window.innerHeight,
    });
  };

  // 드래그 중 최신 위치를 저장하고, 갱신 예약이 없을 때만 다음 프레임을 예약함
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    // 드래그를 시작하지 않은 단순 이동과 다른 포인터의 이벤트는 무시함
    if (dragRef.current?.pointerId !== e.pointerId) return;

    // mouse의 왼쪽 버튼을 놓았는데 종료 이벤트를 놓친 경우도 정리
    // & 1은 왼쪽 버튼 비트만 확인하며, 결과가 0이면 왼쪽 버튼을 놓은 상태이므로 종료함
    if (e.pointerType === "mouse" && (e.buttons & 1) === 0) {
      finishDrag();
      return;
    }

    e.preventDefault();
    updateDragPosition(e.clientX, e.clientY);

    // 최신 좌표만 저장하고, 프레임 예약은 하나만 유지
    if (frameIdRef.current !== null) return;

    frameIdRef.current = requestAnimationFrame(() => {
      frameIdRef.current = null;
      applyPendingLayout();
    });
  };

  // 드래그를 시작한 포인터의 버튼을 놓으면 마지막 좌표를 반영하고 종료함
  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    // 단순 클릭은 자동 배치를 유지하며, 이동했다면 이벤트의 마지막 좌표를 반영
    if (
      drag.hasMoved ||
      e.clientX !== drag.clientX ||
      e.clientY !== drag.clientY
    ) {
      updateDragPosition(e.clientX, e.clientY);
    }

    finishDrag();
  };

  // pointercancel과 lostpointercapture에서 함께 사용하는 중단 처리임
  // 입력이 취소되거나 헤더가 캡처를 잃으면 현재 드래그 중인 포인터(e.pointerId)에 대해서만 종료함
  const onPointerCancel = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) finishDrag();
  };

  // 모달에 적용할 인라인 스타일
  const modalStyle: CSSProperties = {
    transform: `translate(${x}px, ${y}px)`,
    height: layout?.height ?? getDefaultHeight(category),
  };

  return {
    modalStyle,
    isPositioned: layout !== null,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
    },
  };
};
