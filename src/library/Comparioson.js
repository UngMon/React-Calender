export const comparisonHandler = (startDate, endDate) => {
  const 시작날 = startDate.split(".");
  const 마지막날 = endDate.split(".");

  console.log(시작날)
  console.log(마지막날)

  // 시작날 = ['year', 'month', 'date'];
  // 마지막날 = ['year', 'month', 'date'];

  let result; // 1 은 year차이, 2는 month 차이, 3은 date차이, 4는 같은 날, 5는 꽝..

  if (시작날[0] > 마지막날[0]) {
    console.log('?')
    result = 5; // 시작날이 마지막날 연도보다 크면 reducer함수 실행x
  }

  if (+시작날[0] < +마지막날[0]) {
    result = 1; // 시작날의 연도가 마지막 날 연도보다 작으면 longDateList실행
  }

  // 이후는 시작날의 연도가 마지막 날의 연도랑 같은 경우임. 

  if ( 시작날[0] === 마지막날[0]) {

    if (+시작날[1] > +마지막날[1]) {
      console.log('?')
      result = 5; // 시작날의 달이 마지막 날 달 보다 크면 reducer 함수 실행x 
    }

    if (+시작날[1] < +마지막날[1]) {
      result = 2; // 시작날의 달이 마지막 날 달 보다 작으면 LongDateList실행
    }

    if (+시작날[1] === +마지막날[1]) {

      if (+시작날[2] === +마지막날[2]) {
        result = 4; // 둘이 같은 날 이므로 inputList실행
      }

      if (+시작날[2] < +마지막날[2]) {
        result = 3; // LongDateList 실행
      }

      if (+시작날[2] > +마지막날[2]) {
        result = 5; // 꽝.
      }
    }
  }

  
  console.log(result)
  return result;
};
