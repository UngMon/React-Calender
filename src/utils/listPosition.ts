export const listPosition = (
  day: string,
  week: string,
  size: [number, number],
  openEdit: boolean,
  index: number
) => {
  let array = [0, 0];
  let width = size[0];
  let height = size[1];

  // 캘린더 너비에 따른 모달창 위치 조절
  switch (day) {
    case "1":
      array[0] = (width / 7) * +day;
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
        width > 760 ? (width / 7) * (+day - 1.1) - 400 : (width - 400) / 2;
      break;
    case "6":
      array[0] =
        width > 610 ? (width / 7) * (+day - 1.1) - 400 : (width - 400) / 2;
      break;
    default:
      array[0] =
        width > 550 ? (width / 7) * (+day - 1.1) - 400 : (width - 400) / 2;
  }
  console.log(openEdit, index)
  switch (week) {
    case "1":
      array[1] = 26 + 24 + 24 * index;
      break;
    case "2":
      array[1] = 26 + height + 24 + 24 * index;
      break;
    case "3":
      array[1] = !openEdit ? height * (+week - 2) + 50 + 24 * index : height - 96;
      break;
    case "4":
      array[1] = !openEdit ? height * (+week - 2) + 50 + 24 * index : height;
      break;
    case "5":
      array[1] = !openEdit ? height * (+week - 2) + 50 + 24 * index : height - 24;
      break;
    default: // day === 6
      array[1] = !openEdit ? height * (+week - 2) + 50 + 24 * index : height - 24;
  }

  return array;
};

