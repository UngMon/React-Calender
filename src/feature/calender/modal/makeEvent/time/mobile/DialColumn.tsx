import React, { useRef, useState, UIEvent, useEffect, useCallback } from "react";
import "./MobileTimePicker.css";
import { useModalStore } from "../../../../../../store/useModalStore";

interface DialColumnProps {
  width: number;
  items: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  itemHeight?: number;
  isInfinite?: boolean; // 무한 스크롤 여부 옵션
}

const itemHeight = 50;

const DialColumn = ({
  width,
  items,
  value,
  onChange,
  isInfinite,
}: DialColumnProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 무한 스크롤 배열 생성 (100번 반복하여 끊기지 않게 만듦)
  const REPEAT_COUNT = isInfinite ? 50 : 1;
  const displayItems = Array(REPEAT_COUNT).fill(items).flat();

  // 2. 초기 렌더링 시 거대한 배열의 "정중앙"에 위치하도록 인덱스 계산
  const getInitialIndex = useCallback(() => {
    const baseIndex = items.indexOf(value) !== -1 ? items.indexOf(value) : 0;
    if (!isInfinite) return baseIndex;

    // 중앙 블록으로 이동
    const middleBlock = Math.floor(REPEAT_COUNT / 2);
    return middleBlock * items.length + baseIndex;
  }, [items, value, isInfinite, REPEAT_COUNT]);

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);

  // 사용자가 스크롤 중일 때 부모의 상태 변경으로 인해 화면이 튀는 것을 방지
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      const targetIndex = getInitialIndex();
      scrollRef.current.scrollTop = targetIndex * itemHeight;
      setActiveIndex(targetIndex);
    }
  }, [getInitialIndex, itemHeight]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const scrollTop = e.currentTarget.scrollTop;

    // 패딩이 없고 상하단 스페이서가 있으므로, 정확히 중앙의 인덱스가 도출됨
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== activeIndex && displayItems[newIndex] !== undefined) {
      setActiveIndex(newIndex);
      onChange(displayItems[newIndex]);
    }

    // 사용자가 스크롤을 멈췄을 때 실행되는 영역
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;

      // 스크롤이 끝에 다다를 쯤, 중앙으로 되돌리기
      if (isInfinite && scrollRef.current) {
        const itemsLength = items.length;
        // 현재 위치가 몇 번째 반복 블록인지 계산
        const currentBlock = Math.floor(newIndex / itemsLength);

        // 사용자가 양 끝단(상위 5%, 하위 5% 지점)에 다가갔다면?
        if (currentBlock < 5 || currentBlock > REPEAT_COUNT - 5) {
          // 정중앙 블록으로 타겟 변경
          const middleBlock = Math.floor(REPEAT_COUNT / 2);
          // 현재 가리키고 있는 실제 값의 인덱스 (0 ~ itemsLength - 1)
          const baseIndex = newIndex % itemsLength;
          const targetIndex = middleBlock * itemsLength + baseIndex;

          // 애니메이션 없이(smooth X) 즉각적으로 스크롤 위치를 덮어씌움
          // 사용자 눈에는 동일한 숫자가 제자리에 있는 것처럼 보인다.
          scrollRef.current.scrollTop = targetIndex * itemHeight;
          setActiveIndex(targetIndex);
        }
      }
    }, 100); // 150ms 동안 스크롤 이벤트가 없으면 멈춘 것으로 간주
  };

  const handleItemClick = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="dial-column"
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ width: `${width}px` }}
    >
      {/* 완벽한 중앙 정렬을 위한 상단 스페이서 */}
      <div style={{ height: `${itemHeight}px`, flexShrink: 0 }} />

      {displayItems.map((item, index) => {
        const displayItem =
          typeof item === "number" && item < 10 ? `0${item}` : item;
        return (
          <div
            key={`${item}-${index}`}
            className={`dial-item ${index === activeIndex ? "active" : ""}`}
            style={{ height: `${itemHeight}px` }}
            onClick={() => handleItemClick(index)}
          >
            {displayItem}
          </div>
        );
      })}

      {/* 완벽한 중앙 정렬을 위한 하단 스페이서 */}
      <div style={{ height: `${itemHeight}px`, flexShrink: 0 }} />
    </div>
  );
};

export default React.memo(DialColumn);