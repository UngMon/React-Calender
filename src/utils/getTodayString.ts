export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  // 월과 일은 1자리 수일 경우 앞에 '0'을 붙여주는 것이 URL 규격상 안전합니다. (예: 4 -> 04)
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getYMDString = (condition: string): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(0, "2");
  const day = String(today.getDate()).padStart(2, "0");

  if (condition === "YM") return `${year}-${month}`;
  else if (condition === "YMD") return `${year}-${month}-${day}`;
  else return "";
};
