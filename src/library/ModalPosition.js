const ModalPosition = (dayIndex, week, width) => {
  // const width = viewRef.current.clientWidth;
  // const height = viewRef.current.clientHeight;
  // 캘린더 너비에 따른 모달창 위치 조절
  const array = [0, 0];
  if (dayIndex === 1) {
    array[0] = width > 490 ? (width * dayIndex) / 7 + 10 : (width - 400) / 2;
  }

  if (dayIndex === 2) {
    array[0] = width > 590 ? (width * dayIndex) / 7 + 10 : (width - 400) / 2;
  }

  if (dayIndex === 3) {
    array[0] = width > 730 ? (width * dayIndex) / 7 + 10 : (width - 400) / 2;
  }

  if (dayIndex === 4) {
    array[0] =
      width > 980
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - 400) / 2;
  }

  if (dayIndex === 5) {
    array[0] =
      width > 730
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - 400) / 2;
  }

  if (dayIndex === 6) {
    array[0] =
      width > 590
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - 400) / 2;
  }

  if (dayIndex === 7) {
    array[0] =
      width > 490
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - 400) / 2;
  }

  // if (week === 1) {
  //   array[1] = height
  // }

  // const cssDayIndex =
  //   dayIndex === 1
  //     ? width < 480
  //       ? "center"
  //       : "day-1"
  //     : dayIndex === 2
  //     ? width < 580
  //       ? "center"
  //       : "day-2"
  //     : dayIndex === 3
  //     ? width < 720
  //       ? "center"
  //       : "day-3"
  //     : dayIndex === 4
  //     ? width < 936
  //       ? "center"
  //       : "day-4"
  //     : dayIndex === 5
  //     ? width < 720
  //       ? "center"
  //       : "day-5"
  //     : dayIndex === 6
  //     ? width < 936
  //       ? "center"
  //       : "day-6"
  //     : width < 480
  //     ? "center"
  //     : "day-7";

  // const cssWeekIndex =
  //   week === 1
  //     ? "week-1"
  //     : week === 2
  //     ? "week-2"
  //     : week === 3
  //     ? "week-3"
  //     : week === 4
  //     ? "week-4"
  //     : week === 5
  //     ? "week-5"
  //     : "week-6";

  // const cssClasse = cssDayIndex + " " + cssWeekIndex;
  return array[0];
};

export default ModalPosition;
