export const makePosition = (
  week: number,
  day: number,
  width: number,
  height: number,
) => {
  let x = 0,
    y = 0;

  if (day >= 0 && day <= 2) {
    x = width * (day + 1) + 10;
  } else {
    x = (7 - day) * width + 10;
  }

  if (week === 0) {
    y = 120;
  } else if (week >= 1 && week <= 2) {
    y = 120 + 0.5 * height;
  }
  // week 3부터 bottom 기준
  else if (week === 3) {
    y = 1.5 * height;
  } else {
    y = (6 - week) * (height / 2);
  }

  return [x, y];
};
