interface ListPositionParam {
  type: string;
  day: number;
  week: number;
  openEdit: boolean;
  index: number;
  offsetTop: number;
  offsetLeft: number;
  lastweek: number;
  openInMore: boolean;
}

export const listPosition = (param: ListPositionParam): [number, number] => {
  const { type, day, week, openEdit, index, offsetTop, offsetLeft, lastweek } =
    param;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let x: number = 0;
  let y: number = 0;

  if (day + week === 0) {
    // 검색 페이지에서 리스트를 클릭한 경우, day 와 week는 공백
    if (openEdit) {
      x = screenWidth / 2 - 200;
      y = screenHeight / 5;
    } else {
      x = screenWidth > 850 ? screenWidth / 2 : screenWidth / 2 - 200;
      y = offsetTop;
    }
  }

  if (param.openInMore) {
    return [screenWidth / 2 - 200, screenHeight / 15];
  }

  if (day + week !== 0) {
    // 캘린더에서 클릭한 일정의 left 값 계산하기
    const halfScreenWidth: number = screenWidth / 2 - 200;

    if (day === 1) x = screenWidth > 590 ? offsetLeft * day : halfScreenWidth;
    if (day === 2) x = screenWidth > 760 ? offsetLeft * day : halfScreenWidth;
    if (day === 3) x = screenWidth > 1000 ? offsetLeft * day : halfScreenWidth;
    if (day === 4)
      x = screenWidth > 1000 ? offsetLeft * (day - 1) - 410 : halfScreenWidth;
    if (day === 5)
      x = screenWidth > 750 ? offsetLeft * (day - 1) - 410 : halfScreenWidth;
    if (day === 6)
      x = screenWidth > 620 ? offsetLeft * (day - 1) - 410 : halfScreenWidth;
    if (day === 7)
      x = screenWidth > 550 ? offsetLeft * (day - 1) - 410 : halfScreenWidth;

    if (type === "More") {
      // 더보기에서 일정을 클릭한 경우 x, y값 조정
      if (day > 3) x -= 15;
      else x += 10;
      if (week > 3) y = offsetTop - 150 + 24;
      else y = offsetTop;
    }

    if (type !== "More") {
      // 캘린더에서 리스트를 클릭한 경우 y값
      if (week > 3) {
        y = openEdit
          ? offsetTop * (lastweek - week + 1) - 24 * (index + 1)
          : offsetTop * (week - 2) + 24 * (index + 1) + 26;
      } else {
        y = offsetTop * (week - 1) + 24 * index + 26 + 24;
        if (openEdit && week !== 1) y -= 105 * week;
      }
    }
  }

  if (y < 10) y = 10;
  return [x, y];
};
