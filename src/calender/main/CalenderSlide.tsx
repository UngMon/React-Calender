import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { modalActions } from "../../redux/modal-slice";
import { useNavigate } from "react-router-dom";
import { dateActions } from "../../redux/date-slice";
import { makeSlideArray } from "../../utils/makeSlideArray";
import MakeCalender from "./MakeCalender";
import style from "../Calender.module.css";

interface T {
  year: string;
  month: string;
  week: number;
  firstDay: number;
  setIsDragging: (value: boolean) => void;
  viewRef: React.RefObject<HTMLDivElement>;
  listsRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  allListRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  clicekdMoreRef: React.MutableRefObject<HTMLDivElement | null>;
}

const CalenderSlide = ({
  year,
  month,
  setIsDragging,
  viewRef,
  listsRef,
  allListRef,
  clicekdMoreRef,
}: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //[..., [year, month, firstDay, week], ...]
  const calenderArray = makeSlideArray(year, month);
  const [startPoint, setStartPoint] = useState<number>(0);
  const [movingPoint, setMovingPoint] = useState<number>(0);
  const [isScroling, setIsScroll] = useState<boolean>(false);
  const [listBarHegiht, setListBarHeight] = useState<number>(
    window.innerWidth > 500 ? 24 : 20
  );
  const [viewHeight, setViewHeight] = useState<number>(
    window.innerHeight - 80 - 26
  );
  const [viewWidth, setViewWidth] = useState<number>(window.innerWidth);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth <= 500 && window.innerWidth >= 320)
        setViewWidth(window.innerWidth);

      setViewHeight(window.innerHeight - 80 - 26);

      if (window.innerWidth > 500 && calenderArray.length === 1) return;
      if (window.innerWidth <= 500 && calenderArray.length === 3) return;
      slideRef.current!.style.transition = "none";

      dispatch(modalActions.clearSet({ type: "all" }));

      setListBarHeight(window.innerWidth > 500 ? 24 : 20);

      setIsDragging(false);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  });

  const touchStart = (e: React.TouchEvent) => {
    if (window.innerWidth > 500) return;
    setStartPoint(e.touches[0].pageX);
  };

  const touchMove = (e: React.TouchEvent) => {
    if (window.innerWidth > 500) return;
    setMovingPoint(e.touches[0].pageX - startPoint);
    setIsScroll(true);
  };

  const touchEnd = () => {
    if (window.innerWidth > 500) return;
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
            ? `translate(-${viewWidth - movingPoint}px)`
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
          listRef={listsRef}
          allListRef={allListRef}
          clicekdMoreRef={clicekdMoreRef}
          listViewCount={Math.floor(
            (viewHeight / item[3] - 24) / listBarHegiht
          )}
        />
      ))}
    </div>
  );
};

export default CalenderSlide;
