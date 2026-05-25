export const formatTime = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const getInitialTimeRange = () => {
  const now = new Date();
  // 5분 단위로 올림 (예: 12분 -> 15분, 16분 -> 20분)
  const roundedMinutes = Math.ceil(now.getMinutes() / 5) * 5;

  const start = new Date(now);
  start.setMinutes(roundedMinutes);
  start.setSeconds(0);
  start.setMilliseconds(0);

  // 시작 시간에서 15분 추가
  const end = new Date(start.getTime() + 15 * 60 * 1000);

  return {
    startTime: formatTime(start),
    endTime: formatTime(end),
  };
};

// "오전/오후 hh:mm" 형태로 변환
export const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "";

  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);

  // 오전/오후 판별
  const ampm = hour < 12 ? "오전" : "오후";

  // 12시간제로 변환
  hour = hour % 12;
  if (hour === 0) hour = 12;
  
  // 두 자리 숫자로 맞춤 (예: 9 -> 09)
  const hh = String(hour).padStart(2, "0");

  return `${ampm} ${hh}:${minuteStr}`;
};
