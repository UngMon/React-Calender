const ModalPositionTwo = (
  day: string,
  week: string,
  size: [number, number],
  lastweek: number
) => {
  if (size[0] === 0) return;

  const width = size[0];
  const height = size[1];

  const array = [0, 0];

  array[0] = (width * (+day - 1)) / 7;

  switch (day < "4") {
    case true:
      array[0] = (width * (+day - 1)) / 7;;
      break;
    default:
      array[0] = (width * (+day - 7)) / 7;
      break;
  }

  switch (week) {
    case "1":
      array[1] = 26;
      break;
    case "2":
      // array[1] = (height * (+week - 1)) / 6;
      array[1] = (height / lastweek) * (+week - 1);
      break;
    case "3":
      array[1] = (height / lastweek) * (+week - 1);
      break;
    case "4":
      array[1] =
        lastweek > 5
          ? (height * (+week - 2)) / lastweek - 24
          : (height * (+week - 3)) / lastweek - 24;
      break;
    case "5":
      array[1] = lastweek > 5 ? (height * (+week - 4)) / lastweek : 10;
      break;
    default:
      array[1] = height - (height * 2) / 6;
  }
  console.log(array)
  return array;
};

export default ModalPositionTwo;
