import './ColorBox.css';

const ColorBox = ({ color, setColor, openColor, setOpenColor, colorRef}) => {

  const openColorSelector = () => {
    setOpenColor((prevState) => !prevState);
  };

  const selectedColor = (컬러) => {
    setColor(컬러);
    setOpenColor(false);
  };

  return (
    <div className="color-picker">
      <img src="img/palette.png" alt="memo" width="20" className="color-icon" />
      <div className={`${color} circle`} onClick={openColorSelector}></div>
      {openColor && (
        <div className="color-box" ref={colorRef}>
          <div
            onClick={() => selectedColor("토마토")}
            className={`토마토 circle`}
          ></div>
          <div
            onClick={() => selectedColor("연분홍")}
            className={`연분홍 circle`}
          ></div>
          <div
            onClick={() => selectedColor("세이지")}
            className={`세이지 circle`}
          ></div>
          <div
            onClick={() => selectedColor("바나나")}
            className={`바나나 circle`}
          ></div>
          <div
            onClick={() => selectedColor("바질")}
            className={`바질 circle`}
          ></div>
          <div
            onClick={() => selectedColor("공작")}
            className={`공작 circle`}
          ></div>
          <div
            onClick={() => selectedColor("블루베리")}
            className={`블루베리 circle`}
          ></div>
          <div
            onClick={() => selectedColor("라벤더")}
            className={`라벤더 circle`}
          ></div>
          <div
            onClick={() => selectedColor("포도")}
            className={`포도 circle`}
          ></div>
          <div
            onClick={() => selectedColor("흑연")}
            className={`흑연 circle`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ColorBox;
