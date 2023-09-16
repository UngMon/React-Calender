import React, { useEffect, useRef } from "react";
import { hour, minute, hourPosition, minutePosition } from "../type/Etc";

const Dial = () => {
  const dialTwo = useRef<HTMLDivElement>(null);
  const hours = useRef<{ [key: string]: string }>(hour);

  useEffect(() => {
    console.log('dial Effect')
    const scrollHandler = () => {
      console.log("scroll");
    };

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <div className="t-box" ref={dialTwo}>
      <div className="dial-two">
        {Object.values(hours.current).map((item, index) => (
          <div className={`dial-item ${item}`} key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dial;
