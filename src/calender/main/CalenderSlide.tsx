import React, { useEffect, useRef, useState } from "react";
import { ListOrMore } from "../../type/RefType";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { dateActions } from "../../redux/date-slice";
import { makeSlideArray } from "../../utils/MakeSlideArray";
import MakeCalender from "./MakeCalender";
import style from "../Calender.module.css";

interface T {
  year: string;
  month: string;
  week: number;
  firstDay: number;
  setIsDragging: (value: boolean) => void;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
}

const CalenderSlide = ({
  year,
  month,
  setIsDragging,
  viewRef,
  listRef,
  allListRef,
  clicekdMoreRef,
}: T) => {
  console.log('CLanederSlide => MakeCalender')
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [calenderArray, setCalenderArray] = useState<any[][]>(
    makeSlideArray(year, month)
  ); //[..., [year, month, firstDay, week], ...]
  const [startPoint, setStartPoint] = useState<number>(0);
  const [movingPoint, setMovingPoint] = useState<number>(0);
  const [isScroling, setIsScroll] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCalenderArray(makeSlideArray(year, month));
  }, [year, month]);

  useEffect(() => {
    const resizeHandler = () => {
      slideRef.current!.style.transition = "none";
      if (window.innerWidth > 500 && width > 500) return;
      if (window.innerWidth < 320) return;
      setCalenderArray(makeSlideArray(year, month));
      setWidth(window.innerWidth); // 불 필요한 렌더링 줄이기
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  });

  const touchStart = (e: React.TouchEvent) => setStartPoint(e.touches[0].pageX);

  const touchMove = (e: React.TouchEvent) => {
    setMovingPoint(e.touches[0].pageX - startPoint);
    setIsScroll(true);
  };

  const touchEnd = () => {
    const 스크린절반 = viewRef.current!.clientWidth / 2;

    if (Math.abs(movingPoint) > 스크린절반) {
      let newYear: string;
      let newMonth: string;
      let prevOrNext: string;

      if (movingPoint > 0) {
        // 이전 달로 움직임
        newYear = calenderArray[0][0];
        newMonth = calenderArray[0][1];
        prevOrNext = "prev";
        setMovingPoint(스크린절반 * 2);
      }

      if (movingPoint < 0) {
        // 다음 달로 움직임
        newYear = calenderArray[2][0];
        newMonth = calenderArray[2][1];
        prevOrNext = "next";
        setMovingPoint(-스크린절반 * 2);
      }

      setTimeout(() => {
        slideRef.current!.style.transition = "none";
        setMovingPoint(0);
        prevOrNext === "next"
          ? dispatch(dateActions.nextMonth())
          : dispatch(dateActions.prevMonth());
        navigate(`/calender/date?year=${newYear}&month=${newMonth}`);
      }, 320);
    } else {
      // 횡스크롤의 움직임이 절반을 넘지 않을 경우 제자리로...
      setMovingPoint(0);
    }
    setIsScroll(false);
  };

  return (
    <div
      className={style.slide}
      style={{
        transform:
          window.innerWidth <= 500
            ? `translate(-${window.innerWidth - movingPoint}px)`
            : "none",
        transition: !isScroling ? "all 0.3s linear" : "none",
      }}
      onTouchStart={(e) => touchStart(e)}
      onTouchMove={(e) => touchMove(e)}
      onTouchEnd={touchEnd}
      ref={slideRef}
    >
      {calenderArray.map((item, index) => (
        <MakeCalender
          key={index}
          year={item[0]}
          month={item[1]}
          firstDay={item[2]}
          week={item[3]}
          isScroling={isScroling}
          setIsDragging={setIsDragging}
          viewRef={viewRef}
          listRef={listRef}
          allListRef={allListRef}
          clicekdMoreRef={clicekdMoreRef}
        />
      ))}
    </div>
  );
};

export default CalenderSlide;
