export const morePosition = (
  day: string,
  week: string,
  size: [number, number],
  lastweek: number
) => {
  if (size[0] === 0) return;

  const width = size[0];
  const height = size[1];

  const array = [0, 0];

  switch (day) {
    case "1":
      array[0] = 0;
      break;
    case "7":
      array[0] = width - 230;
      break;
    default: // 1 < day < 7
      array[0] = (width * (+day - 1)) / 7 + width / 14 - 115;
      break;
  }

  switch (week) {
    case "1":
      array[1] = 26;
      break;
    case String(lastweek):
      array[1] = height - 270;
      break;
    default: // 1 < week < lastweek
      array[1] =
        (height / lastweek) * (+week - 1) + height / (lastweek * 2) - 120;
  }
  return array;
};

