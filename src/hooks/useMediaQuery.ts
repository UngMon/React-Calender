import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

// export const useMediaQuery = (query: string) => {
//   const getMatches = () => {
//     // 브라우저 환경인지 구분하기 위함
//     if (typeof window === "undefined") {
//       return false;
//     }
//     // 컴포넌트가 첫 렌더링때 뷰포트 너비가 모바일인지 pc인지 구분
//     return window.matchMedia(query).matches;
//   };

//   // 처음 렌더링때의 뷰포트 구분한 값을 저장
//   const [matches, setMatches] = useState(getMatches);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia(query);

//     const handleChange = (event: MediaQueryListEvent) => {
//       setMatches(event.matches);
//     };

//     // 이전의 최초 값 동기화 한다.
//     // 이 커스텀 훅을 사용하는 컴포넌트마다 쿼리 조건이 다를 수 있기에
//     // useEffect의 의존성 배열에 query가 변경됨에 따라 새롭게 matches값을 동기화
//     setMatches(mediaQuery.matches);

//     // 브라우저에 뷰포트 change 이벤트 등록
//     mediaQuery.addEventListener("change", handleChange);
//     // 클린업
//     return () => {
//       mediaQuery.removeEventListener("change", handleChange);
//     };
//   }, [query]);

//   return matches;
// };

export const useMediaQuery = (query: string) => {
  // 1. 구독함수: 이벤트 리스너 등록 및 해제 역할
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    [query],
  );

  // 2. 현재 상태(Snapshot)를 가져오는 함수
  const getSnapshot = () => window.matchMedia(query).matches;

  // 3. 서버 환경(SSR)에서 렌더링될 때 사용할 기본값(현재 ssr은 잘 모르므로 일단 기본값 false로 지정)
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
