const MakeLongArr = (startInfo, endInfo) => {
  const idxArr = [];

  const firstYear = startInfo[0];
  const firstMonth = startInfo[1];
  const firstDate = startInfo[2];

  const secondYear = endInfo[0];
  const secondMonth = endInfo[1];
  const secondDate = endInfo[2];

  if (+firstYear === +secondYear) {
    if (+firstMonth === +secondMonth) {
      // 같은 년도 같은 달이면, secondDate 까지 idxArr에 push
      for (let i = +firstDate; i <= +secondDate; i++) {
        idxArr.push(firstYear + "-" + firstMonth + "-" + i);
      }
      console.log(idxArr);
    }

    if (+firstMonth < +secondMonth) {
      let k;

      for (let m = +firstMonth; m <= +secondMonth; m++) {
        //  1 <= m <= 12이므로 m-1 할 필요 없음.
        console.log(m);
        k = new Date(firstYear, m, 0).getDate(); // 그 달의 마지막 날

        if (m !== +secondMonth) {
          for (let d = +firstDate; d <= k; d++) {
            idxArr.push(firstYear + "-" + m + "-" + d);
          }
          // continue;
        }

        if (m === +secondMonth) {
          for (let d = 1; d <= secondDate; d++) {
            idxArr.push(firstYear + "-" + m + "-" + d);
          }
          // break;
        }
        console.log(idxArr);
      }
    }
  }

  if (+firstYear < +secondYear) {
    let k;
    for (let y = +firstYear; y <= +secondYear; y++) {
      console.log(y);
      if (y === +firstYear) {
        for (let m = +firstMonth; m <= 12; m++) {
          k = new Date(y, m, 0).getDate();

          if (m === +firstMonth) {
            for (let d = +firstDate; d <= k; d++) {
              idxArr.push(y + "-" + m + "-" + d);
            }
            continue;
          }

          for (let d = 1; d <= k; d++) {
            idxArr.push(y + "-" + m + "-" + d);
          }
        }
        console.log(idxArr);
        continue;
      }

      if (y === +secondYear) {
        console.log('여기?')
        for (let m = 1; m <= +secondMonth; m++) {
          console.log(m)
          k = new Date(y, m, 0).getDate();

          if (m === +secondMonth) {
            console.log('m === secondMonth')
            for (let d = 1; d <= +secondDate; d++) {
              idxArr.push(y + "-" + m + "-" + d);
            }
            break;
          }

          for (let d = 1; d <= k; d++) {
            idxArr.push(y + "-" + m + "-" + d);
          }
          continue; 
        }
        console.log(idxArr);
        break;
      }

      // y가 firstYear, secondYear 사이일 때,
      for (let m = 1; m <= 12; m++) {
        k = new Date(y, m, 0).getDate();

        for (let d = 1; d <= k; d++) {
          idxArr.push(y + "-" + m + "-" + d);
        }
      }
      console.log(idxArr);
    }
  }

  return idxArr;
};

export default MakeLongArr;
