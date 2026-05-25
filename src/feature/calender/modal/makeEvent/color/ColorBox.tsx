import { useEffect, useRef, useState } from "react";
import "./ColorBox.css";

// interface T {
//   platform: string;
//   color: string;
//   setColor: (value: string) => void;
//   openColor: boolean;
//   setOpenColor: (value: boolean) => void;
// }

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

const ColorBox = () => {
  const [color, setColor] = useState<string>("라벤더");
  const [open, setOpen] = useState<boolean>(false);
  const colorRef = useRef<HTMLDivElement>(null);

  const selectedColor = (color: string) => {
    setColor(color);
    setOpen(false);
  };

  // useEffect(() => {
  //   if (!open) return;
  //   const clickHandler = (e: MouseEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     if (!colorRef.current!.contains(e.target as Node)) {
  //       setOpen(false);
  //     }
  //   };

  //   window.addEventListener("click", clickHandler);
  //   return () => window.removeEventListener("click", clickHandler);
  // });

  return (
    <div className="color-container" ref={colorRef}>
      {/* {platform === "pc" && (
        <div className="color-icon">
          <img src="../images/palette.png" alt="palette" width="20" />
        </div>
      )} */}
      <div className="color-icon">
        <span className="material-symbols-outlined">palette</span>
      </div>
      <div className="color-box">
        <button className="color-opener" onClick={() => setOpen(!open)}>
          <span>컬러 선택</span>
          <span className={`${color}`}></span>
        </button>
        {open && (
          <div className="colors">
            {colorArray.map((item) => (
              <div
                key={item}
                onClick={() => selectedColor(item)}
                className={`${item} ${color === item && "picked"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorBox;
