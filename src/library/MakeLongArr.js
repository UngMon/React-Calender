const MakeLongArr = (
  firstYear,
  firstMonth,
  firstDate,
  secondYear,
  secondMonth,
  secondDate
) => {
  const idxArr = [];

  if (firstYear === secondYear) {
    if (firstMonth === secondMonth) {
      // 같은 달에서 마지막 date까지 idxArr 배열에 push
      for (let i = +firstDate; i <= +secondDate; i++) {
        idxArr.push(firstYear + "." + firstMonth + "." + i);
      }
    } else if (firstMonth < secondMonth) {
      let k;
      for (let i = +firstMonth; i <= +secondMonth; i++) {
        if (i < +secondMonth) {
          // 선택한 달 보다 적을 때,
          k = new Date(secondYear, i, 0).getDate(); // month는 1~12이므로 +1을 해줄 필요 x

          for (let j = +firstDate; j <= k; j++) {
            console.log(j);
            idxArr.push(secondYear + "." + i + "." + j);
          }
        } else {
          for (let j = 1; j <= +secondDate; j++) {
            idxArr.push(secondYear + "." + i + "." + j);
          }
        }
      }
    }
  } else if (firstYear < secondYear) {
    let k;
    for (let y = firstYear; y <= secondYear; y++) {
      if (y < secondYear) {
        for (let m = firstMonth; m <= 12; m++) {
          k = new Date(firstYear, m, 0).getDate();
          if (m === firstMonth) {
            for (let d = firstDate; d <= k; d++) {
              idxArr.push(y + "." + m + "." + d);
            }
          } else {
            for (let d = 1; d <= k; d++) {
              idxArr.push(y + "." + m + "." + d);
            }
          }
        }
      } else {
        for (let m = 1; m <= secondMonth; m++) {
          k = new Date(secondYear, m, 0).getDate();
          for (let d = 1; d <= secondDate; d++) {
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
