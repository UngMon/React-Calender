import React, { useEffect, useRef, useState } from "react";
import { hour, minute, hourPosition, minutePosition } from "../../type/Etc";
import style from "./MobileTime.module.css";

interface T {
  type: string;
  startTime: string;
  endTime: string;
  timeInputOneRef: React.RefObject<HTMLInputElement>;
  timeInputTwoRef: React.RefObject<HTMLInputElement>;
}

const period: { [key: number]: string } = {
  0: "오전",
  40: "오후",
};

const MobileTimePicker = ({
  type,
  startTime,
  endTime,
  timeInputOneRef,
  timeInputTwoRef,
}: T) => {
  const dialOne = useRef<HTMLDivElement>(null);
  const dialTwo = useRef<HTMLDivElement>(null);
  const dialThree = useRef<HTMLDivElement>(null);
  const scrollY = useRef<number>(-10);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isScrolling, setIsScrolling] = useState<boolean>(false); // 스크롤 중인지 여부
  const [clickedDial, setClickedDial] = useState<string>(""); // 사용자가 클릭한 다이얼
  const [isTouch, setTouch] = useState<boolean>(false); // 사용자가 터치중인지
  const [fixedHeight, setFixedHeight] = useState<boolean>(false); // 사용자가 터치를 뗀 시점에서 다이얼의 위치가 조정중인지

  useEffect(() => {
    if (isScrolling || isTouch || !isFirst) return;

    const [startPeriod, startHour, startMinute] = startTime
      .match(/(\S+) (\d+):(\d+)/)!
      .slice(1);
    const [endPeriod, endHour, endMinute] = endTime
      .match(/(\S+) (\d+):(\d+)/)!
      .slice(1);

    if (type === "start") {
      if (startPeriod === "오전") dialOne.current!.scrollTop = 0;
      else dialOne.current!.scrollTop = 40;

      dialTwo.current!.scrollTop = hourPosition[startHour] * 40;
      dialThree.current!.scrollTop = minutePosition[startMinute] * 40;
    } else {
      if (endPeriod === "오전") dialOne.current!.scrollTop = 0;
      else dialOne.current!.scrollTop = 40;

      dialTwo.current!.scrollTop = hourPosition[endHour] * 40;
      dialThree.current!.scrollTop = minutePosition[endMinute] * 40;
    }
    setIsFirst(false);
  }, [isScrolling, isTouch, startTime, endTime, type, isFirst]);

  useEffect(() => {
    // 스크롤 상태가 아니면서, scollY가 초기 값이 아닌 상태, 컴포넌트의 첫 마운트가 아닌 경우에
    if (scrollY.current === -10 || isScrolling || isFirst) return;
    const scrollTop = Math.round(scrollY.current / 40) * 40;
    let height: number;

    if (clickedDial === "one")
      dialOne.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    else if (clickedDial === "two")
      dialTwo.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    else dialThree.current!.scrollTo({ top: scrollTop, behavior: "smooth" });

    scrollY.current = -10;

    setTimeout(() => {
      if (scrollTop <= 480) height = 480 + scrollTop;
      else if (scrollTop >= 840) height = scrollTop - 480;
      else height = scrollTop;

      if (clickedDial === "two") dialTwo.current!.scrollTop = height;
      if (clickedDial === "three") dialThree.current!.scrollTop = height;
    }, 40);
  }, [scrollY, isScrolling, clickedDial, isTouch, isFirst]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    if (fixedHeight) return;

    if (!isScrolling) return setIsScrolling(true);

    scrollY.current = e.currentTarget.scrollTop;

    let time =
      period[dialOne.current!.scrollTop >= 40 ? 40 : 0] +
      " " +
      hour[Math.round(dialTwo.current!.scrollTop / 40) + 1] +
      ":" +
      minute[Math.round(dialThree.current!.scrollTop / 40) + 1];

    if (type === "start") timeInputOneRef.current!.value = time;
    else timeInputTwoRef.current!.value = time;

    if (isTouch) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      setFixedHeight(true);
    }, 50);
  };

  const clickHandler = (t: string, index: number) => {
    if (t === "시간") {
      dialTwo.current!.scrollTo({ top: (index - 1) * 40, behavior: "smooth" });
    } else if (t === "분") {
      dialThree.current!.scrollTo({
        top: (index - 1) * 40,
        behavior: "smooth",
      });
    } else dialOne.current!.scrollTo({ top: index * 40, behavior: "smooth" });
  };

  const touchStartHandler = () => {
    setIsScrolling(true);
    setFixedHeight(false);
    setTouch(true);
  };

  const touchEndHandler = (type: string) => {
    setIsScrolling(false);
    setClickedDial(type);
    setTouch(false);
  };

  return (
    <div className={style[`time-selector`]}>
      <div className={style["time-seperate"]}>
        <div className={style.boundary}></div>
        <div className={style.boundary}></div>
        <div className={style.boundary}></div>
      </div>
      <div
        className={style["time-box"]}
        ref={dialOne}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("one")}
      >
        <div className={style.dial}>
          <div className={style["dial-item"]}></div>
          <div
            className={style["dial-item"]}
            onClick={() => clickHandler("오전", 0)}
          >
            오전
          </div>
          <div
            className={style["dial-item"]}
            onClick={() => clickHandler("오후", 1)}
          >
            오후
          </div>
          <div className={style["dial-item"]}></div>
        </div>
      </div>
      <div
        className={style["time-box"]}
        ref={dialTwo}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("two")}
      >
        <div className={style.dial}>
          {Object.values(hour).map((item, index) => (
            <div
              className={style["dial-item"]}
              key={index}
              onClick={() => clickHandler("시간", index)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div
        className={style["time-box"]}
        ref={dialThree}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("three")}
      >
        <div className={style.dial}>
          {Object.values(minute).map((item, index) => (
            <div
              className={style["dial-item"]}
              key={index}
              onClick={() => clickHandler("분", index)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTimePicker;
