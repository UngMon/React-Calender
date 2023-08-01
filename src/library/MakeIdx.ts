const MakeIdx = (order, year, month, date) => {
  date = date < 10 ? '0' + date : date;

  if (order === "prev") {
    if (month === 1) {
      return year - 1 + "-" + 12 + "-" + date;
    } else {
      month = month - 1 < 10 ? "0" + (month - 1) : month - 1;
      return year + "-" + month + "-" + date;
    }
  } else if (order === "next") {
    if (month === 12) {
      return year + 1 + "-01-" + date;
    } else {
      month = month + 1 < 10 ? "0" + (month + 1) : month + 1;
      return year + "-" + month + "-" + date;
    }
  } else {
    month = month < 10 ? "0" + (month) : month;
    return year + "-" + month + "-" + date;
  }
};

export default MakeIdx;
