const newDate = new Date();
export const newYear = String(newDate.getFullYear());
export const newMonth = String(newDate.getMonth() + 1).padStart(2, "0");

