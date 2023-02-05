const ModalPosition = (dayIndex, week, size) => {
  let width = size[0];
  let height = size[1];
  // 캘린더 너비에 따른 모달창 위치 조절

  const modalWidth = width > 500 ? 400 : width > 335 ? 300 : 230;

  if (size[0] === "") {
    console.log("here");
    return ["", ""];
  }

  let array = [0, 0];
  console.log(modalWidth)
  if (dayIndex === 1) {
    array[0] =
      width > 500 ? (width * dayIndex) / 7 + 10 : (width - modalWidth) / 2;
  }

  if (dayIndex === 2) {
    array[0] =
      width > 590 ? (width * dayIndex) / 7 + 10 : (width - modalWidth) / 2;
  }

  if (dayIndex === 3) {
    array[0] =
      width > 730 ? (width * dayIndex) / 7 + 10 : (width - modalWidth) / 2;
  }

  if (dayIndex === 4) {
    array[0] =
      width > 980
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - modalWidth) / 2;
  }

  if (dayIndex === 5) {
    array[0] =
      width > 730
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - modalWidth) / 2;
  }

  if (dayIndex === 6) {
    array[0] =
      width > 590
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - modalWidth) / 2;
  }

  if (dayIndex === 7) {
    array[0] =
      width > 490
        ? width - (width * (8 - dayIndex)) / 7 - 410
        : (width - modalWidth) / 2;
  }

  if (week === 1) {
    array[1] = 0;
  }

  if (week === 2) {
    array[1] = height > 370 ? (height * 1) / 6 : 0;
  }

  if (week === 3) {
    array[1] = height > 375 ? (height * 2) / 6 - 100 : 0;
  }

  if (week === 4) {
    array[1] = height > 510 ? (height - 400) - 50 : 0;
  }

  if (week === 5) {
    array[1] = height > 440 ? (height - 400) : 0;
  }

  if (week === 6) {
    array[1] = (height * 3) / 6 - 70;
  }

  return array;
};

export default ModalPosition;
