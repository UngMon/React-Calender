const ModalPosition = (day: string, week: string, size: [number, number]) => {
  let width = size[0];
  let height = size[1];
  let array = [0, 0];
  // 캘린더 너비에 따른 모달창 위치 조절

  const modalWidth = width > 500 ? 400 : width > 335 ? 300 : 230;
console.log(day, week, width)
  switch (day) {
    case "1":
      array[0] =
        width > 500 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
      break;
    case "2":
      array[0] =
        width > 590 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
      break;
    case "3":
      array[0] =
        width > 730 ? (width * +day) / 7 - 20 : (width - modalWidth) / 2;
      break;
    case "4":
      array[0] =
        width > 1000
          ? width - (width * (8 - +day)) / 7 - 430
          : (width - modalWidth) / 2;
      break;
    case "5":
      array[0] =
        width > 760
          ? width - (width * (8 - +day)) / 7 - 430
          : (width - modalWidth) / 2;
      break;
    case "6":
      array[0] =
        width > 630
          ? width - (width * (8 - +day)) / 7 - 440
          : (width - modalWidth) / 2;
      break;
    default:
      array[0] =
        width > 530
          ? width - (width * (8 - +day)) / 7 - 450
          : (width - modalWidth) / 2;
  }

  switch (week) {
    case "1":
      array[1] = height > 400 ? 0 : -20;
      break;
    case "2":
      array[1] = height > 560 ? (height * 1) / 6 : -20;
      break;
    case "3":
      array[1] = height > 550 ? (height * 2) / 6 - 100 : -20;
      break;
    case "4":
      array[1] = ((height - 24 - 64) / 6) * 2.5 - 24;
  
      if (height < 700) array[1] = (height - 24 - 64 - 300) / 3;
  
      if (height < 520) array[1] = -20;
      break;
    case "5":
      array[1] = ((height - 24 - 64) / 6) * 3 - 24;
  
      if (height < 790) array[1] = (height - 24 - 64 - 300) / 2;
  
      if (height < 550) array[1] = -20;
      break;
    case "6":
      array[1] = (height * 3) / 6 - 70;
  
      if (height < 790) array[1] = (height - 24 - 64 - 300) / 1.5;
  
      if (height < 650) array[1] = (height - 24 - 64 - 300) / 2;
  
      if (height < 550) array[1] = (height - 24 - 64 - 300) / 2.5;
  
      if (height < 520) array[1] = -20;
      break;
    default:
      array[1] = -20;
  }
  console.log(array)
  return array;
};

export default ModalPosition;
