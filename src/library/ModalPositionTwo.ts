const ModalPositionTwo = (day: string, week: string, size: [number, number]) => {
    if (size[0] === 0) return;

    const width = size[0];
    const height = size[1];

    const array = [0, 0];

    switch (parseInt(day)) {
      case 1:
        array[0] = width > 350 ? 0 : width / 2 - 120;
        break;
      case 2:
        array[0] =
          width > 350 ? width / 7 + (width / 7 - 230) / 2 : width / 2 - 120;
        break;
      case 3:
        array[0] =
          width > 350 ? (width * 2) / 7 + (width / 7 - 230) / 2 : width / 2 - 120;
        break;
      case 4:
        array[0] =
          width > 320 ? (width * 3) / 7 + (width / 7 - 230) / 2 - 20 : width / 2 - 115;
        break;
      case 5:
        array[0] =
          width > 320 ? (width * 4) / 7 + (width / 7 - 230) / 2 - 35 : width / 2 - 115;
        break;
      case 6:
        array[0] =
          width > 320 ? (width * 5) / 7 + (width / 7 - 230) / 2 - 45 : width / 2 - 115;
        break;
      default:
        array[0] = width > 320 ? width - 330 : width / 2 - 115;
    }
    
    switch (parseInt(week)) {
      case 1:
        array[1] = 10;
        break;
      case 2:
        array[1] = (height * (+week - 1)) / 6;
        break;
      case 3:
        array[1] = height - 240 - (height * 2.5) / 6;
        break;
      case 4:
        array[1] = height - (height * 3) / 6;
        break;
      case 5:
        array[1] = height - (height * 2) / 6;
        break;
      default:
        array[1] = height - (height * 2) / 6;
    }

    // if (day === "1") array[0] = width > 350 ? 0 : width / 2 - 120;

    // if (day === "2")
    //   array[0] =
    //     width > 350 ? width / 7 + (width / 7 - 230) / 2 : width / 2 - 120;

    // if (day === "3")
    //   array[0] =
    //     width > 350 ? (width * 2) / 7 + (width / 7 - 230) / 2 : width / 2 - 120;

    // if (day === "4")
    //   array[0] =
    //     width > 320 ? (width * 3) / 7 + (width / 7 - 230) / 2  - 20: width / 2 - 115;

    // if (day === "5")
    //   array[0] =
    //     width > 320 ? (width * 4) / 7 + (width / 7 - 230) / 2  - 35 : width / 2 - 115;

    // if (day === "6")
    //   array[0] = width > 320 ? (width * 5) / 7 + (width / 7 - 230) / 2  - 45 : width / 2 - 115;


    // if (day === "7") array[0] = width > 320 ? (width) - 330 : width / 2 - 115;
    // ////////////////////////////////////////////////

    // if (week === "1") array[1] = 10;

    // if (week === "2") array[1] = (height * (+week - 1)) / 6;

    // if (week === "3") array[1] = height - 240 - (height * 2.5) / 6;

    // if (week === "4") array[1] = height - (height * 3 / 6);

    // if (week === "5") array[1] = height - (height * 2 / 6);

    // if (week === "6") array[1] = height - (height * 2 / 6);

    return array;
  };

export default ModalPositionTwo;