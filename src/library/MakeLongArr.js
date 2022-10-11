const MakeLongArr = (firsYear, firsMonth, firsDate, year, month, date) => {
  const idxArr = [];
  //   const monthArr = [];

  let firstYear = +firsYear;
  let firstMonth = +firsMonth;
  let firstDate = +firsDate;

  if (firstYear === year) {
    if (firstMonth === month) {
      for (let i = +firstDate; i <= +date; i++) {
        idxArr.push(firstYear + "." + firstMonth + "." + i);
      }
      console.log("같은 달");
    } else {
      console.log("다른 달");
      /* 둘이 같지 않다는 것은 마지막 날이 다음 달 이상 */
      let k;
      for (let i = +firstMonth; i <= +month; i++) {
        if (i < +month) {
          // 선택한 달 보다 적을 때,
          k = new Date(year, i, 0).getDate(); // month는 1~12이므로 +1을 해줄 필요 x
          console.log(k);
          console.log(i);
          console.log(firsDate);
          for (let j = +firstDate; j <= k; j++) {
            console.log(j);
            idxArr.push(year + "." + i + "." + j);
          }
        } else {
          for (let j = 1; j <= +date; j++) {
            idxArr.push(year + "." + i + "." + j);
          }
        }
      }
    }
  }
  console.log(idxArr);
  return idxArr;
};

export default MakeLongArr;
