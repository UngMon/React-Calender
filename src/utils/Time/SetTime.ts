const SetTime = () => {
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let currentTime = "";
  let lastTime = "";

  const hourMakeHandler = (hour: number) => {
    switch (true) {
      case hour < 12:
        currentTime = "오전 ";
        lastTime = hour === 11 ? '오후 ' : "오전 ";
        break;
      case hour === 23:
        currentTime = "오후 ";
        lastTime = "오전 ";
        hour -= 12;
        break;
      default:
        currentTime = "오후 ";
        lastTime = "오후 ";
        hour -= 12;
    }

    currentTime += hour.toString().padStart(2, "0");
    lastTime += (hour + 1 === 12 ? 0 : hour + 1).toString().padStart(2, "0");
  };

  // 15분 단위로 사용자가 선택할 수 있게끔 했음
  minute = Math.ceil(minute / 15) * 15;

  switch (true) {
    case minute === 60 || minute === 0:
      minute = 0;
      break;
    default:
  }

  hourMakeHandler(hour);

  currentTime = currentTime + ":" + minute.toString().padStart(2, '0');
  lastTime = lastTime + ":" + minute.toString().padStart(2, '0');

  return { currentTime, lastTime };
};

export default SetTime;
