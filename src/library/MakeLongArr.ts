const MakeLongArr = (startDate: string[], endDate: string[]) => {
  const array = [];

  const startYear = +startDate[0];
  const startMonth = +startDate[1];
  const startDat = +startDate[2];

  const endYear = +endDate[0];
  const endMonth = +endDate[1];
  const endDat = +endDate[2];

  for (let y = startYear; y <= endYear; y++) {
    let startM: number = y === startYear ? startMonth : 1;
    let endM: number = y === endYear ? endMonth : 12;

    for (let m = startM; m <= endM; m++) {
      let startD = y === startYear && m === startMonth ? startDat : 1;
      let endD =
        y === endYear && m === endMonth ? endDat : new Date(y, m, 0).getDate();

      for (let d = startD; d <= endD; d++) {
        array.push(y + "-" + m + "-" + d);
      }
    }
  }

  // if (startYear === endYear) {
  //   if (+startMonth === +endMonth) {
  //     // 같은 년도 같은 달이면, secondDate 까지 idxArr에 push
  //     for (let i = +startDat; i <= +endDat; i++) {
  //       const date = i < 10 ? "0" + i : i;
  //       idxArr.push(startYear + "-" + startMonth + "-" + date);
  //     }
  //   }

  //   if (+startMonth < +endMonth) {
  //     let k;

  //     for (let m = +startMonth; m <= +endMonth; m++) {
  //       //  1 <= m <= 12이므로 m-1 할 필요 없음.
  //       k = new Date(+startYear, m, 0).getDate(); // 그 달의 마지막 날
  //       console.log(m);

  //       const month = m < 10 ? "0" + m : m;

  //       if (m === +startMonth) {
  //         for (let d = +startDat; d <= k; d++){
  //           const date = d < 10 ? '0' + d: d;
  //           idxArr.push(startYear + '-' + month + '-' +date);
  //         }
  //         continue;
  //       }

  //       if (m === +endMonth) {
  //         for (let d = 1; d <= +endDat; d++) {
  //           console.log(m);
  //           const date = d < 10 ? "0" + d : d;
  //           idxArr.push(startYear + "-" + month + "-" + date);
  //         }
  //         break;
  //       }

  //       for (let d = 1; d <= k; d++) {
  //         console.log(m);
  //         const date = d < 10 ? "0" + d : d;
  //         idxArr.push(startYear + "-" + month + "-" + date);
  //       }
  //     }
  //   }
  // }

  // if (startYear < endYear) {
  //   let k;
  //   for (let y = +startYear; y <= +endYear; y++) {
  //     if (y === +startYear) {
  //       for (let m = +startMonth; m <= 12; m++) {
  //         k = new Date(y, m, 0).getDate();

  //         if (m === +startMonth) {
  //           for (let d = +startDat; d <= k; d++) {
  //             const month = m < 10 ? "0" + m : m;
  //             const date = d < 10 ? "0" + d : d;
  //             idxArr.push(y + "-" + month + "-" + date);
  //           }
  //           continue;
  //         }

  //         for (let d = 1; d <= k; d++) {
  //           const month = m < 10 ? "0" + m : m;
  //           const date = d < 10 ? "0" + d : d;
  //           idxArr.push(y + "-" + month + "-" + date);
  //         }
  //       }

  //       continue;
  //     }

  //     if (y === +endYear) {
  //       for (let m = 1; m <= +endMonth; m++) {
  //         k = new Date(y, m, 0).getDate();

  //         if (m === +endMonth) {
  //           for (let d = 1; d <= +endDat; d++) {
  //             const month = m < 10 ? "0" + m : m;
  //             const date = d < 10 ? "0" + d : d;
  //             idxArr.push(y + "-" + month + "-" + date);
  //           }
  //           break;
  //         }

  //         for (let d = 1; d <= k; d++) {
  //           const month = m < 10 ? "0" + m : m;
  //           const date = d < 10 ? "0" + d : d;
  //           idxArr.push(y + "-" + month + "-" + date);
  //         }
  //         continue;
  //       }

  //       break;
  //     }

  //     // y가 firstYear, secondYear 사이일 때,
  //     for (let m = 1; m <= 12; m++) {
  //       k = new Date(y, m, 0).getDate();

  //       for (let d = 1; d <= k; d++) {
  //         const month = m < 10 ? "0" + m : m;
  //         const date = d < 10 ? "0" + d : d;
  //         idxArr.push(y + "-" + month + "-" + date);
  //       }
  //     }
  //   }
  // }

  return array;
};

export default MakeLongArr;
