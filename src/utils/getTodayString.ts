// export const getTodayDateString = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   // 월과 일은 1자리 수일 경우 앞에 '0'을 붙여주는 것이 URL 규격상 안전함. (예: 4 -> 04)
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

export const getYMDString = (condition: string): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  if (condition === "Y") return `${year}`;
  else if (condition === "M") return `${year}/${month}`;
  else if (condition === "W" || condition === "D")
    return `${year}/${month}/${day}`;
  else if (condition === "YMD") return `${year}-${month}-${day}`;
  else return "";
};
