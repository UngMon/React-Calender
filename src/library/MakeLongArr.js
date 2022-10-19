const MakeLongArr = (startInfo, endInfo) => {
  const idxArr = [];

  const firstYear = startInfo[0];
  const firstMonth = startInfo[1];
  const firstDate = startInfo[2];

  const secondYear = endInfo[0];
  const secondMonth = endInfo[1];
  const secondDate = endInfo[2];

  if (firstYear === secondYear) {
    if (+firstMonth === +secondMonth) {
      // 같은 달에서 마지막 date까지 idxArr 배열에 push
      for (let i = +firstDate; i <= +secondDate; i++) {
        idxArr.push(firstYear + "." + firstMonth + "." + i);
      }
    } else {
      // firstMonth < secondMonth
      let k;
      for (let m = +firstMonth; m <= +secondMonth; m++) {
        k = new Date(firstYear, m, 0).getDate(); // month는 1~12이므로 +1을 해줄 필요 x
        if (m === +firstMonth) {
          // 시작 날짜의 달 부터,
          // 여기 j 값 수정 바람
          for (let d = +firstDate; d <= k; d++) {
            idxArr.push(firstYear + "." + m + "." + d);
          }
        } else if (m === +secondMonth) {
          for (let d = 1; d <= +secondDate; d++) {
            idxArr.push(firstYear + "." + m + "." + d);
          }
        } else {
          for (let d = 1; d <= k; d++) {
            idxArr.push(firstYear + "." + m + "." + d);
          }
        }
      }
    }
  } else if (firstYear < secondYear) {
    let k;
    for (let y = firstYear; y <= secondYear; y++) {
      if (y === firstYear) {
        // 현재 연도가 다음 연도보다 적을 때,
        for (let m = +firstMonth; m <= 12; m++) {
          k = new Date(firstYear, m, 0).getDate();
          if (m === +firstMonth) {
            for (let d = +firstDate; d <= k; d++) {
              idxArr.push(y + "." + m + "." + d);
            }
          } else {
            for (let d = 1; d <= k; d++) {
              idxArr.push(y + "." + m + "." + d);
            }
          }
        }
      } else if (y === secondYear) {
        for (let m = 1; m <= +secondMonth; m++) {
          k = new Date(secondYear, m, 0).getDate();
          for (let d = 1; d <= k; d++) {
            idxArr.push(y + "." + m + "." + d);
          }
        }
      } else {
        for (let m = 1; m <= 12; m++) {
          k = new Date(y, m, 0).getDate();
          for (let d = 1; d <= k; d++) {
            idxArr.push(y + "." + m + "." + d);
          }
        }
      }
    }
  }
  console.log(idxArr);
  return idxArr;
};

export default MakeLongArr;
