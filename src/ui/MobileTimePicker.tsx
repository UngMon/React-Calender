import React, { useEffect, useRef, useState } from "react";
import { hour, minute, hourPosition, minutePosition } from "../type/Etc";

interface T {
  type: string;
  startTime: string;
  endTime: string;
}

const MobileTimePicker = ({ type, startTime, endTime }: T) => {

  const hours = useRef<{ [key: string]: string }>(hour);
  const minutes = useRef<{ [key: string]: string }>(minute);

  const [startPeriod, startHour, startMinute] = startTime
    .match(/(\S+) (\d+):(\d+)/)!
    .slice(1);

  const [endPeriod, endHour, endMinute] = endTime
    .match(/(\S+) (\d+):(\d+)/)!
    .slice(1);

  const dialOne = useRef<HTMLDivElement>(null);
  const dialTwo = useRef<HTMLDivElement>(null);
  const dialThree = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>(-10); // 현재 스크롤 위치
  const [isScrolling, setIsScrolling] = useState<boolean>(false); // 스크롤 중인지 여부
  const [clickedDial, setClickedDial] = useState<string>("");
  const [touch, setTouch] = useState<boolean>(false);
  const [heightFix, setHeightFix] = useState<boolean>(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("effect");

    if (type === "start") {
      if (startPeriod === "오전") {
        dialOne.current!.scrollTop = 0;
      } else {
        dialOne.current!.scrollTop = 40;
      }
      dialTwo.current!.scrollTop = hourPosition[startHour] * 40;
      dialThree.current!.scrollTop = minutePosition[startMinute] * 40;
    } else {
      if (endPeriod === "오전") {
        dialOne.current!.scrollTop = 0;
      } else {
        dialOne.current!.scrollTop = 40;
      }
      dialTwo.current!.scrollTop = hourPosition[endHour] * 40;
      dialThree.current!.scrollTop = minutePosition[endMinute] * 40;
    }
  }, [
    startPeriod,
    endPeriod,
    type,
    hours,
    minutes,
    startHour,
    startMinute,
    endHour,
    endMinute,
  ]);

  useEffect(() => {
    if (scrollY === -10) return;
    if (isScrolling) return;
    // console.log("effect", scrollY, isScrolling, touch);
    const scrollTop = Math.round(scrollY / 40) * 40;
    let hegith: number;
    if (clickedDial === "one") {
      if (scrollY === dialOne.current!.scrollTop)
        dialOne.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    } else if (clickedDial === "two") {
      if (scrollY === dialTwo.current!.scrollTop) {
        dialTwo.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    } else {
      if (scrollY === dialThree.current!.scrollTop)
        dialThree.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
    setScrollY(-10);
    setHeightFix(true);
    setTimeout(() => {
      if (scrollTop <= 400) hegith = 480 + scrollTop;
      else if (scrollTop >= 840) hegith = scrollTop - 480;
      else hegith = scrollTop

      if (clickedDial === "two") dialTwo.current!.scrollTop = hegith;
      if (clickedDial === "three") dialThree.current!.scrollTop = hegith;
    }, 80);
    setTimeout(() => {
      setHeightFix(false);
    }, 150);
  }, [scrollY, isScrolling, clickedDial, touch]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    if (heightFix) return;
    if (!isScrolling) setIsScrolling(true);

    setScrollY(e.currentTarget.scrollTop);

    if (touch) return;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      console.log("scroll touch", touch);
      setIsScrolling(false);
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
    } else {
      dialOne.current!.scrollTo({ top: index * 40, behavior: "smooth" });
    }
  };

  const touchStartHandler = () => {
    setTouch(true);
  };

  const touchEndHandler = (type: string) => {
    setTouch(false);
    setIsScrolling(false);
    setClickedDial(type);
  };

  return (
    <div className="time-selector">
      <div className="t-seperate" style={{ left: 0 }}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div
        className="t-box"
        ref={dialOne}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("one")}
      >
        <div className="dial-two">
          <div className="dial-item"></div>
          <div className="dial-item" onClick={() => clickHandler("오전", 0)}>
            오전
          </div>
          <div className="dial-item" onClick={() => clickHandler("오후", 1)}>
            오후
          </div>
          <div className="dial-item"></div>
        </div>
      </div>
      <div
        className="t-box"
        ref={dialTwo}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("two")}
      >
        <div className="dial-two">
          {Object.values(hours.current).map((item, index) => (
            <div
              className="dial-item"
              key={index}
              onClick={() => clickHandler("시간", index)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div
        className="t-box"
        ref={dialThree}
        onScroll={scrollHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={() => touchEndHandler("three")}
      >
        <div className="dial-two">
          {Object.values(minutes.current).map((item, index) => (
            <div
              className="dial-item"
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
