export const comparisonHandler = (startDate, endDate) => {

  const 시작날 = startDate.split('.');
  const 마지막날 = endDate.split('.');

  // 시작날 = ['year', 'month', 'date'];
  // 마지막날 = ['year', 'month', 'date'];

  if (시작날[0] === 마지막날[0]) {
    // 시작 날의 연도가 마지막 날의 연도보다 작거나 같을 때,
    if (+시작날[1] < +마지막날[1]) {
      // 시작 날의 달이 마지막 날의 달 보다 작을 때, true
      return true;
    } else if (+시작날[1] === +마지막날[1]) {
      // 또는 둘의 달이 같을 때,
      return +시작날[2] <= +마지막날[2] ? true : false;
    } else {
      // 시작 날의 달이 마지막 날의 달 보다 크다면 그냥 false;
      // ex) 2022.12.31 < 2023.1.1
      return false;
    }
  } else if (시작날[0] < 마지막날[0]) {
    // 마지막 날의 연도가 시작 날 보다 크다면 그냥 true;
    return true;
  } else {
    // 시작 날의 년도가 마지막 날의 연도보다 크면 그냥 false
    return false;
  }
};
