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

// if (hour < 9) {
//   currentTime = "오전 0" + hour;
//   lastTime = "오전 0" + (hour + 1);
// }

// if (hour === 9) {
//   currentTime = "오전 0" + hour;
//   lastTime = "오전 " + (hour + 1);
// }

// if (hour === 10) {
//   currentTime = "오전 10";
//   lastTime = "오전 11";
// }

// if (hour === 11) {
//   currentTime = "오전 11";
//   lastTime = "오후 00";
// }

// if (hour === 12) {
//   currentTime = "오후 00";
//   lastTime = "오후 01";
// }

// if (12 < hour) {
//   if (hour < 22) {
//     currentTime = "오후 0" + (hour - 12);
//     lastTime = "오후 0" + (hour - 11);
//   }

//   if (hour === 21) {
//     lastTime = "오후 10";
//   }
// }

// if (hour === 22) {
//   currentTime = "오후 10";
//   lastTime = "오후 11";
// }

// if (hour === 23) {
//   currentTime = "오후 11";
//   lastTime = "오전 00";
// }

// if (hour === 24) {
//   currentTime = "오전 00";
//   lastTime = "오전 01";
// }
// if (minute === 60) {
//   minute = 0;
//   hourMakeHandler(hour + 1);
// }

// if (minute === 0) {
//   hourMakeHandler(hour);
//   minute = 0;
// }

// if (0 < minute && minute < 60) {
//   hourMakeHandler(hour);
// }
