import React, { useEffect, useRef, useState } from "react";
import { hour, minute, hourPosition, minutePosition } from "../type/Etc";
import { useAppDispatch } from "../redux/store";

interface T {
  type: string;
  startTime: string;
  endTime: string;
}

let isFirst = true;

const MobileTimePicker = ({ type, startTime, endTime }: T) => {
  const dispatch = useAppDispatch();
  console.log("Mobile Time Picker");

  const dialOne = useRef<HTMLDivElement>(null);
  const dialTwo = useRef<HTMLDivElement>(null);
  const dialThree = useRef<HTMLDivElement>(null);

  const scrollY = useRef<number>(-10);
  // const [scrollY, setScrollY] = useState<number>(-10); // 현재 스크롤 위치
  const [isScrolling, setIsScrolling] = useState<boolean>(false); // 스크롤 중인지 여부
  const [clickedDial, setClickedDial] = useState<string>(""); // 사용자가 클릭한 다이얼
  const [isTouch, setTouch] = useState<boolean>(false); // 사용자가 터치중인지
  const [fixedHeight, setFixedHeight] = useState<boolean>(false); // 사용자가 터치를 뗀 시점에서 다이얼의 위치가 조정중인지
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isScrolling || isTouch) return;
    console.log("effect one!!");

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
  }, [isScrolling, isTouch, startTime, endTime, type]);

  useEffect(() => {
    if (scrollY.current === -10 || isScrolling || isFirst) return;
    console.log("effect Two");

    const scrollTop = Math.round(scrollY.current / 40) * 40;
    let hegith: number;
    if (clickedDial === "one") {
      if (scrollY.current === dialOne.current!.scrollTop)
        dialOne.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    } else if (clickedDial === "two") {
      if (scrollY.current === dialTwo.current!.scrollTop) {
        dialTwo.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    } else {
      if (scrollY.current === dialThree.current!.scrollTop)
        dialThree.current!.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
    scrollY.current = -10;
    // setScrollY(-10);
    setFixedHeight(true);

    setTimeout(() => {
      if (scrollTop <= 400) hegith = 480 + scrollTop;
      else if (scrollTop >= 840) hegith = scrollTop - 480;
      else hegith = scrollTop;

      if (clickedDial === "two") dialTwo.current!.scrollTop = hegith;
      if (clickedDial === "three") dialThree.current!.scrollTop = hegith;
      console.log(hegith / 40 + 1);
    }, 80);
    setTimeout(() => {
      setFixedHeight(false);
    }, 150);
  }, [scrollY, isScrolling, clickedDial, isTouch]);

  const heightAdjustment = (scrollTop: number) => {
    scrollY.current = scrollTop;
    const period = dialOne.current!.scrollTop === 0 ? "오전" : "오후";
    const time =
      period +
      " " +
      hour[`${Math.round(dialTwo.current!.scrollTop / 40) + 1}`] +
      ":" +
      minute[`${Math.round(dialThree.current!.scrollTop / 40) + 1}`];

    // if (type === "start")
    //   dispatch(timeActions.selectFristTime({ firstTime: time }));
    // else dispatch(timeActions.selectLastTime({ lastTime: time }));
  };

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    if (fixedHeight) return;
    if (!isScrolling) {
      setIsScrolling(true);
      return;
    }
    if (isFirst) isFirst = false;
    const scrollTop = e.currentTarget.scrollTop
    heightAdjustment(scrollTop);

    if (isTouch) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      console.log("scroll touch", isTouch);
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
    console.log(" touch End !!!!!!!!!!!!!!!!", isScrolling, isTouch);
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
          {Object.values(hour).map((item, index) => (
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
          {Object.values(minute).map((item, index) => (
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
