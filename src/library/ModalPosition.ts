const ModalPosition = (day: string, week: string, size: [number, number]) => {
  let width = size[0];
  let height = size[1];
  // 캘린더 너비에 따른 모달창 위치 조절

  const modalWidth = width > 500 ? 400 : width > 335 ? 300 : 230;

  let array = [0, 0];
  if (day === '1') {
    array[0] =
      width > 500 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
  }

  if (day === '2') {
    array[0] =
      width > 590 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
  }

  if (day === '3') {
    array[0] =
      width > 730 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
  }

  if (day === '4') {
    array[0] =
      width > 1000
        ? width - (width * (8 - +day)) / 7 - 430
        : (width - modalWidth) / 2;
  }

  if (day === '5') {
    array[0] =
      width > 760
        ? width - (width * (8 - +day)) / 7 - 430
        : (width - modalWidth) / 2;
  }

  if (day === '6') {
    array[0] =
      width > 630
        ? width - (width * (8 - +day)) / 7 - 440
        : (width - modalWidth) / 2;
  }

  if (day === '7') {
    array[0] =
      width > 530
        ? width - (width * (8 - +day)) / 7 - 450
        : (width - modalWidth) / 2;
  }

  if (week === '1') {
    array[1] = height > 400 ? 0 : -20;
  }

  if (week === '2') {
    array[1] = height > 560 ? (height * 1) / 6 : -20;
  }

  if (week === '3') {
    array[1] = height > 550 ? (height * 2) / 6 - 100 : -20;
  }

  if (week === '4') {
    array[1] = ((height - 24 - 64) / 6) * 2.5 - 24;

    if (height < 700) array[1] = (height - 24 - 64 - 300) / 3;

    if (height < 520) array[1] = -20;
  }

  if (week === '5') {
    array[1] = ((height - 24 - 64) / 6) * 3 - 24;

    if (height < 790) array[1] = (height - 24 - 64 - 300) / 2;

    if (height < 550) array[1] = -20;
  }

  if (week === '6') {
    array[1] = (height * 3) / 6 - 70;

    if (height < 790) array[1] = (height - 24 - 64 - 300) / 1.5;

    if (height < 650) array[1] = (height - 24 - 64 - 300) / 2;

    if (height < 550) array[1] = (height - 24 - 64 - 300) / 2.5;

    if (height < 520) array[1] = -20;
  }

  return array;
};

export default ModalPosition;
