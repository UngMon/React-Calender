const ModalPosition = (dayIndex, week) => {
  const cssDayIndex =
    dayIndex === 1
      ? "day-1"
      : dayIndex === 2
      ? "day-2"
      : dayIndex === 3
      ? "day-3"
      : dayIndex === 4
      ? "day-4"
      : dayIndex === 5
      ? "day-5"
      : dayIndex === 6
      ? "day-6"
      : "day-7";

  const cssWeekIndex =
    week === 1
      ? "week-1"
      : week === 2
      ? "week-2"
      : week === 3
      ? "week-3"
      : week === 4
      ? "week-4"
      : week === 5
      ? "week-5"
      : "week-6";

    const cssClasse = cssDayIndex + ' ' + cssWeekIndex;
  return cssClasse;
};

export default ModalPosition;
