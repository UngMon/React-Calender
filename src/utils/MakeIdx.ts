const MakeIdx = (order: string, year: string, month: string, date: number) => {
  
  switch (order) {
    case "prev":
      year = month === "01" ? `${+year - 1}` : year;
      month = month === "01" ? "12" : String(+month - 1);
      break;
    case "next":
      year = month === "12" ? `${+year + 1}` : year;
      month = month === "12" ? "12" : month;
      break;
    default:
  }
  
  return (
    year + "-" + month.padStart(2, "0") + "-" + String(date).padStart(2, "0")
  );
};

export default MakeIdx;
