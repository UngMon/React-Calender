import React, { useRef, useState } from "react";
import { ColorType } from "@/type/events";
import "./ColorBox.css";

const colorArray: ColorType[] = [
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

interface Props {
  type: "make" | "edit";
  colorValue: ColorType;
  setEventColor: (color: ColorType, category: "make" | "edit") => void;
}

const ColorBox = ({ type, colorValue, setEventColor }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const colorRef = useRef<HTMLDivElement>(null);
  console.log(colorValue);
  const selectedColor = (color: ColorType) => {
    console.log("here", type);
    setEventColor(color, type);
    setOpen(false);
  };

  return (
    <div className="color-container" ref={colorRef}>
      <div className="color-icon">
        <span className="material-symbols-outlined">palette</span>
      </div>
      <div className="color-box">
        <button
          type="button"
          className="color-opener"
          onClick={() => setOpen(!open)}
        >
          <span>컬러 선택</span>
          <span className={`${colorValue}`}></span>
        </button>
        {open && (
          <div className="colors">
            {colorArray.map((item) => (
              <div
                key={item}
                onClick={() => selectedColor(item)}
                className={`${item} ${colorValue === item && "picked"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ColorBox);
