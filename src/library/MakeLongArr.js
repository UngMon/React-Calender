const MakeLongArr = (startInfo, endInfo) => {
  const idxArr = [];
  console.log(startInfo);
  console.log(endInfo);
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
        const date = i < 10 ? "0" + i : i;
        idxArr.push(firstYear + "-" + firstMonth + "-" + date);
      }
    }

    if (+firstMonth < +secondMonth) {
      let k;

      for (let m = +firstMonth; m <= +secondMonth; m++) {
        //  1 <= m <= 12이므로 m-1 할 필요 없음.
        k = new Date(firstYear, m, 0).getDate(); // 그 달의 마지막 날
        console.log(m);

        const month = m < 10 ? "0" + m : m;

        if (m === +firstMonth) {
          for (let d = +firstDate; d <= k; d++){
            const date = d < 10 ? '0' + d: d;
            idxArr.push(firstYear + '-' + month + '-' +date);
          }
          continue;
        }

        if (m === +secondMonth) {
          for (let d = 1; d <= secondDate; d++) {
            console.log(m);
            const date = d < 10 ? "0" + d : d;
            idxArr.push(firstYear + "-" + month + "-" + date);
          }
          break;
        }

        for (let d = 1; d <= k; d++) {
          console.log(m);
          const date = d < 10 ? "0" + d : d;
          idxArr.push(firstYear + "-" + month + "-" + date);
        }
      }
    }
  }

  if (+firstYear < +secondYear) {
    let k;
    for (let y = +firstYear; y <= +secondYear; y++) {
      if (y === +firstYear) {
        for (let m = +firstMonth; m <= 12; m++) {
          k = new Date(y, m, 0).getDate();

          if (m === +firstMonth) {
            for (let d = +firstDate; d <= k; d++) {
              const month = m < 10 ? "0" + m : m;
              const date = d < 10 ? "0" + d : d;
              idxArr.push(y + "-" + month + "-" + date);
            }
            continue;
          }

          for (let d = 1; d <= k; d++) {
            const month = m < 10 ? "0" + m : m;
            const date = d < 10 ? "0" + d : d;
            idxArr.push(y + "-" + month + "-" + date);
          }
        }

        continue;
      }

      if (y === +secondYear) {
        for (let m = 1; m <= +secondMonth; m++) {
          k = new Date(y, m, 0).getDate();

          if (m === +secondMonth) {
            for (let d = 1; d <= +secondDate; d++) {
              const month = m < 10 ? "0" + m : m;
              const date = d < 10 ? "0" + d : d;
              idxArr.push(y + "-" + month + "-" + date);
            }
            break;
          }

          for (let d = 1; d <= k; d++) {
            const month = m < 10 ? "0" + m : m;
            const date = d < 10 ? "0" + d : d;
            idxArr.push(y + "-" + month + "-" + date);
          }
          continue;
        }

        break;
      }

      // y가 firstYear, secondYear 사이일 때,
      for (let m = 1; m <= 12; m++) {
        k = new Date(y, m, 0).getDate();

        for (let d = 1; d <= k; d++) {
          const month = m < 10 ? "0" + m : m;
          const date = d < 10 ? "0" + d : d;
          idxArr.push(y + "-" + month + "-" + date);
        }
      }
    }
  }
  console.log(idxArr);
  return idxArr;
};

export default MakeLongArr;
