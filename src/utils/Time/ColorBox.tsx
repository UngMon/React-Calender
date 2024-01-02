import React, { useEffect, useRef } from "react";
import style from "./ColorBox.module.css";
import { useAppDispatch } from "../../redux/store";
import { cloneActions } from "../../redux/clone-slice";

interface T {
  platform: string;
  color: string;
  setColor: (value: string) => void;
  openColor: boolean;
  setOpenColor: (value: boolean) => void;
}

const colorArray = [
  "토마토",
  "연분홍",
  "세이지",
  "바나나",
  "바질",
  "공작",
  "블루베리",
  "라벤더",
  "포도",
  "흑연",
];

const ColorBox = ({
  platform,
  color,
  setColor,
  openColor,
  setOpenColor,
}: T) => {
  const dispatch = useAppDispatch();
  const colorRef = useRef<HTMLDivElement>(null);

  const selectedColor = (color: string) => {
    setColor(color);
    setOpenColor(false);
    dispatch(cloneActions.changeColor({ color }));
  };

  useEffect(() => {
    if (!openColor) return;
    const clickHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(colorRef.current!.contains(e.target as Node));
      if (!colorRef.current!.contains(e.target as Node)) {
        console.log("??????????");
        setOpenColor(false);
      }
    };

    window.addEventListener("click", clickHandler);
    return () => window.removeEventListener("click", clickHandler);
  });

  return (
    <div
      className={`${style["color-container"]} ${
        platform === "mobile" ? color : "none"
      }`}
      ref={colorRef}
    >
      {platform === "pc" && (
        <div className={style["color-icon"]}>
          <img src="../images/palette.png" alt="palette" width="20" />
        </div>
      )}
      <div
        className={`${color} ${style.circle} `}
        onClick={() => setOpenColor(!openColor)}
      ></div>
      <div className={`${style.colors} ${openColor ? style['c-on'] : style['c-off']}`}>
        {colorArray.map((item) => (
          <div
            key={item}
            onClick={() => platform === "pc" && selectedColor(item)}
            onTouchEnd={() => platform === "mobile" && selectedColor(item)}
            className={`${item} ${color === item && "picked"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorBox;
