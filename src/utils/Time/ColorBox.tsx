import React from "react";
import "./ColorBox.css";

interface T {
  color: string;
  setColor: (value: string) => void;
  openColor: boolean;
  setOpenColor: (value: boolean) => void;
  colorRef: React.RefObject<HTMLDivElement>;
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
  color,
  setColor,
  openColor,
  setOpenColor,
  colorRef,
}: T) => {
  const selectedColor = (컬러: string) => {
    setColor(컬러);
    setOpenColor(false);
  };

  return (
    <div className="color-picker" ref={colorRef}>
      <img
        src="../images/palette.png"
        alt="memo"
        width="20"
        className="color-icon"
      />
      <div
        className={`${color} circle`}
        onClick={() => {
          console.log("colorClick");
          setOpenColor(!openColor);
        }}
      ></div>
      <div
        className="color-box"
        style={{ display: openColor ? "flex" : "none" }}
      >
        {colorArray.map((item) => (
          <div
            key={item}
            onClick={() => selectedColor(item)}
            className={`${item} circle`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorBox;
