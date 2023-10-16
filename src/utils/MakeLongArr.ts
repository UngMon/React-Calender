export const makeDateArray = (start: string, end: string) => {
  const array = [];

  const [startYear, startMonth, startDate] = start.split("-");
  const [endYear, endMonth, endDate] = end.split("-");

  for (let y = +startYear; y <= +endYear; y++) {
    let startM: number = y === +startYear ? +startMonth : 1;
    let endM: number = y === +endYear ? +endMonth : 12;

    for (let m = startM; m <= endM; m++) {
      let startD = y === +startYear && m === +startMonth ? +startDate : 1;
      let endD =
        y === +endYear && m === +endMonth
          ? +endDate
          : new Date(y, m, 0).getDate();

      for (let d = startD; d <= +endD; d++) {
        array.push(
          y +
            "-" +
            m.toString().padStart(2, "0") +
            "-" +
            d.toString().padStart(2, "0")
        );
      }
    }
  }
  return array;
};
