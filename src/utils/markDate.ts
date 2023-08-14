export const markDate = (startDate: string, endDate: string) => {
  const s = startDate.split("-");
  const e = endDate.split("-");
  let result: string[] = [`${s[0]}년 ${s[1]}월 ${s[2]}일`];

  switch (true) {
    case s[0] === e[0] && s[1] === e[1] && s[2] === e[2]:
      result.push(""); // 같은 년도, 같은 달, 같은 날
      break;
    case s[0] === e[0] && s[1] === e[1] && s[2] !== e[2]:
      result.push(`${e[2]}일`); // 같은 년도, 같은 달, 다른 날
      break;
    case s[0] === e[0] && s[1] !== e[1]:
      result.push(`${e[1]}월 ${e[2]}일`); // 같은 년도, 다른 달
      break;
    default: // 다른 년도
      result.push(`${e[0]}년 ${e[1]}월 ${e[2]}일`);
  }

  return result;
};
