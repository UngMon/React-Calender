import { useEffect, useRef } from "react";

export const useClickOutside = (handler: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // ref가 연결되어 있지 않거나, 이벤트 타겟이 모달 영역을 포함할 때는 무시
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    // 화면 전체에 클릭/터치 이벤트 등록
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref; // 컴포넌트에서 사용할 수 있도록 ref 반환
};


