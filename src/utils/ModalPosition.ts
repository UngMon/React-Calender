const ModalPosition = (day: string, week: string, size: [number, number]) => {
  let array = [0, 0];

  let width = size[0];
  let height = size[1];

  // 캘린더 너비에 따른 모달창 위치 조절
  switch (day) {
    case "1":
      array[0] = width > 500 ? (width / 7) * +day : (width - 400) / 2;
      break;
    case "2":
      array[0] = width > 590 ? (width / 7) * +day : (width - 400) / 2;
      break;
    case "3":
      array[0] = width > 730 ? (width / 7) * +day : (width - 400) / 2;
      break;
    case "4":
      array[0] = width > 1000 ? (width / 7) * +day : (width - 400) / 2;
      break;
    case "5":
      array[0] =
        width > 760 ? (width / 7) * (+day - 1.2) - 400 : (width - 400) / 2;
      break;
    case "6":
      array[0] =
        width > 610 ? (width / 7) * (+day - 1.2) - 400 : (width - 400) / 2;
      break;
    default:
      array[0] =
        width > 550 ? (width / 7) * (+day - 1.2) - 400 : (width - 400) / 2;
  }

  switch (week) {
    case "1":
      array[1] = 24;
      break;
    case "2":
      array[1] = height * (+week - 1) - 72;
      break;
    case "3":
      array[1] = height * (+week - 1) - 72;
      break;
    case "4":
      array[1] = height * (+week - 1) - 72;
      break;
    case "5":
      array[1] = height * (+week - 2);
      break;
    default: // day === 6
      array[1] = height * (+week - 2);
  }

  return array;
};

export default ModalPosition;
