const Time = () => {
  const time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let currentTime = "";
  let lastTime = "";

  if (hour <13) {
    if (hour < 10) {
      currentTime = '오전 0' + hour;
      lastTime = '오전 0' + (hour + 1);
    } else {
      if (hour === 11) {
        currentTime = '오전 ' + hour;
        lastTime = '오후 00';
      } else if (hour === 12) {
        hour = '00';
        currentTime = '오후 ' + hour ;
        lastTime = '오후 ' + (hour + 1);
      } else {
        currentTime = '오전 ' + hour;
        lastTime = '오전 ' + (hour + 1);
      }
    }
  } else {
    currentTime = '오후 ' + hour;
    lastTime = '오후 ' + hour;
    if (hour === 23) {
      lastTime = '오전 00';
    }
  };
  
  if (minute % 15 !== 0) {
    minute = Math.ceil(minute / 15) * 15;
    currentTime = currentTime + ':' + minute;
    lastTime = lastTime + ':' + minute;
  } else {
    currentTime = currentTime + ':' + minute;
    lastTime = lastTime + ':' + minute;
  }

  return { currentTime, lastTime };
};

export default Time;

// if (hour < 12) {
//   if (hour < 10) {
//     hour = "0" + hour;
//   }
//   currentTime = "오전 ";
//   lastTime = "오전 ";
// } else {
//   hour -= 12;
//   currentTime = "오후 ";
//   lastTime = "오후 ";
//   if (hour < 10) {
//     hour = "0" + hour;
//     console.log(hour);
//   } else if (hour === 11) {
//     lastTime = "오전";
//   }
// }

// if (minute % 15 !== 0) {
//   minute = Math.ceil(minute / 15) * 15;
//   if (minute === 60) {
//     hour += 1;
//     if (hour === 12) {
//       hour = '0';
//     }
//     minute = "00";
//   }
//   currentTime = currentTime + hour + ":" + minute;
//   lastTime = lastTime + (hour + 1) + ":" + minute;
//   console.log(hour);
// } else {
//   if (minute === 0) {
//     minute = "0" + minute;
//   }
//   currentTime = currentTime + hour + ":" + minute;
//   lastTime = lastTime + (hour + 1) + ":" + minute;
// }
