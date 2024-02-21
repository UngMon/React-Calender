export const calculateModalHeight = (
  offset: number,
  openCalender: boolean,
  opneTime: boolean
): number | string => {
  let height: number | string = "auto";
  const innerHeight = window.innerHeight;

  if (openCalender && offset + 560 - innerHeight > -65)
    height = innerHeight - (25 + 45 + 30 + 65 + offset);
  else if (opneTime && offset + 444 - innerHeight > -65)
    height = innerHeight - (25 + 45 + 30 + 65 + offset);
  else if (!openCalender && !opneTime && offset + 300 + 70 > innerHeight)
    height = innerHeight - (25 + 45 + 30 + 65 + offset);

  return height;
};
