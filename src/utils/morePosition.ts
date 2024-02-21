export const morePosition = (
  day: string,
  week: string,
  size: [number, number],
  lastweek: number
) => {
  if (size[0] === 0) return;

  const width = size[0];
  const height = size[1];
  let x = 0,
    y = 0;

  switch (day) {
    case "1":
      x = 0;
      break;
    case "7":
      x = width - 230;
      break;
    default: // 1 < day < 7
      x = (width * (+day - 1)) / 7 + width / 14 - 115;
      break;
  }

  switch (week) {
    case "1":
      y = 26;
      break;
    case String(lastweek):
      y = height - 270;
      break;
    default: // 1 < week < lastweek
      y = (height / lastweek) * (+week - 1) + height / (lastweek * 2) - 120;
  }

  if (x < 0) x = 0;
  if (y < 0) y = 0;

  return [x, y];
};
