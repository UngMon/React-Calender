export const calculateWidth = (date: string, day: number, endDate: string): number => {
  const time = new Date(date).getTime() + 24 * 60 * 60 * 1000 * (7 - day);

  let lastDateOfWeek = new Date(time).toISOString().split("T")[0];

  if (lastDateOfWeek < endDate) return 7 - day + 1;
  else return new Date(endDate).getDay() + 1 - day + 1;
};
