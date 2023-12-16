import React from "react";
import pc from "./PcColorBox.module.css";
import mobile from "./MobileColorBox.module.css";

interface T {
  platform: string;
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
  platform,
  color,
  setColor,
  openColor,
  setOpenColor,
  colorRef,
}: T) => {
  const selectedColor = (color: string) => {
    setColor(color);
    setOpenColor(false);
  };
  console.log(openColor);
  return (
    <div
      className={`${
        platform === "pc" ? pc["color-container"] : mobile["color-container"]
      } ${platform === "mobile" ? color : "none"}`}
      ref={colorRef}
    >
      {platform === "pc" && (
        <div className={pc["color-icon"]}>
          <img src="../images/palette.png" alt="palette" width="20" />
        </div>
      )}
      <div
        className={`${color} ${platform === "pc" ? pc.circle : mobile.circle} `}
        onClick={() => setOpenColor(!openColor)}
      ></div>
      {openColor && (
        <div
          className={`${platform === "pc" ? pc["colors"] : mobile["colors"]} ${
            !openColor && pc.off
          }`}
        >
          {colorArray.map((item) => (
            <div
              key={item}
              onClick={() => platform === "pc" && selectedColor(item)}
              onTouchEnd={() => platform === "mobile" && selectedColor(item)}
              className={`${item} ${color === item && "picked"}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorBox;
