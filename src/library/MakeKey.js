const MakeKey = (order, year, month, date) => {
  if (order === "prev") {
    if (month === 1) {
      return year - 1 + "-" + 12 + "-" + date;
    } else {
      return year + "-" + (month - 1) + "-" + date;
    }
  } else if (order === "next") {
    if (month === 12) {
      return year + 1 + "-" + 1 + "-" + date;
    } else {
      return year + "-" + (month + 1) + "-" + date;
    }
  } else {
    return year + "-" + month + "-" + date;
  }
};

export default MakeKey;
