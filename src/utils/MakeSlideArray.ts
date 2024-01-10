export const makeSlideArray = (
  year: string,
  month: string
): Array<[string, string, number, number]> => {
  const prevMonth = +month - 1 === 0 ? "12" : String(+month - 1);
  const nextMonth = +month + 1 === 13 ? "01" : String(+month + 1);

  const prevYear = prevMonth === "12" ? String(+year - 1) : year;
  const nextYear = nextMonth === "01" ? String(+year + 1) : year;

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();
  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

  const prevFirstDay: number = new Date(+prevYear, +prevMonth - 1, 1).getDay();
  const prevLastDate: number = new Date(+prevYear, +prevMonth, 0).getDate();
  const prevWeek: number = Math.ceil((prevFirstDay + prevLastDate) / 7);

  const nextFirstDay: number = new Date(+nextYear, +nextMonth - 1, 1).getDay();
  const nextLastDate: number = new Date(+nextYear, +nextMonth, 0).getDate();
  const nextWeek: number = Math.ceil((nextFirstDay + nextLastDate) / 7);

  return window.innerWidth > 500
    ? [[year, month, +firstDay, +week]]
    : [
        [prevYear, prevMonth, +prevFirstDay, +prevWeek],
        [year, month, +firstDay, +week],
        [nextYear, nextMonth, +nextFirstDay, +nextWeek],
      ];
};
