export const setTime = () => {
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let currentTime = "";
  let lastTime = "";

  switch (true) {
    case hour < 12:
      currentTime = "오전 ";
      lastTime = hour === 11 ? "오후 " : "오전 ";
      break;
    default: // 12 <= hour 
      currentTime = "오후 ";
      lastTime = hour === 23 ? "오전 " : "오후 ";
      hour -= 12;
  }

  currentTime += hour.toString().padStart(2, "0");
  lastTime += (hour + 1 === 12 ? 0 : hour + 1).toString().padStart(2, "0");

  // 15분 단위로 사용자가 선택할 수 있게끔 했음
  minute = Math.ceil(minute / 15) * 15;

  switch (true) {
    case minute === 60 || minute === 0:
      minute = 0;
      break;
    default:
  }

  currentTime = currentTime + ":" + minute.toString().padStart(2, "0");
  lastTime = lastTime + ":" + minute.toString().padStart(2, "0");

  return { currentTime, lastTime };
};
