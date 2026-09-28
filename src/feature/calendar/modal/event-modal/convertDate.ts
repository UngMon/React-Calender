export const convertDate = (start_date: string, end_date: string): string => {
  const [start_year, start_month, start_day] = start_date.split("-");
  const [end_year, end_month, end_day] = end_date.split("-");

  if (start_year === end_year) {
    if (start_month === end_month) {
      return `${start_year}년 ${start_month}월 ${start_day}일 ~ ${end_day}일`;
    } else
      return `${start_year}년 ${start_month}월 ${start_day}일 ~ ${end_month}월 ${end_day}일`;
  } else
    return `${start_year}년 ${start_month}월 ${start_day}일 ~ ${end_year}년 ${end_month}월 ${end_day}일`;
};

