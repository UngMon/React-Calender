interface CalendrParams {
  year?: string;
  month?: string;
  day?: string;
}

// url 방어 함수
export const isValidCalendarParams = ({ year, month, day }: CalendrParams) => {
  // 1.  연도(year) 검증: 4자리 숫자, 2000~2099까지의 범위
  if (year !== undefined) {
    if (!/^\d{4}$/.test(year)) return false;
    const y = Number(year);
    if (y < 2000 || y > 2099) return false;
  }

  // 2. 월(month) 검증: 01 ~ 12 (두 자리 필요함)
  if (month !== undefined) {
    if (!/^(0[1-9]|1[0-2])$/.test(month)) return false;
  }

  // 3. 일(day) 검증: 01 ~ 31 및 해당 달이 몇일 까지 있는지 확인하기
  if (day !== undefined) {
    if (!/^(0[1-9]|[12]\d|3[01])$/.test(day)) return false;

    // 연도, 월 정보가 모두 있는 경우, 실제 해당 달의 날짜가 존재하는지 확인하기
    if (year !== undefined && month !== undefined) {
      const y = Number(year);
      const m = Number(month);
      const d = Number(day);

      // 자바스크립트 Date 객체를 이용해서 존재하지 않는 날짜 찾기
      // 해당 달 보다 day가 더 크다면 다음 달로 넘어가게됨 
      const testDate = new Date(y, m - 1, d);

      if (
        testDate.getFullYear() !== y ||
        testDate.getMonth() + 1 !== m ||
        testDate.getDate() !== d
      )
        return false;
    }
  }

  

  return true;
};
