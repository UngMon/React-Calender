import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";

const MakeCaledner = ({ year, month, firstDay, lastDate }) => {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.modal.schedule);

  const makeKey = (identy, year, month, date) => {
    if (identy === "prev") {
      if (month === 0) {
        return year - 1 + "." + 11 + "." + date;
      } else {
        return year + "." + (month - 1) + "." + date;
      }
    } else if (identy === "next") {
      if (month === 11) {
        return year + 1 + "." + 0 + "." + date;
      } else {
        return year + "." + (month + 1) + "." + date;
      }
    } else {
      return year + "." + month + "." + date;
    }
  };

  const scheduleHandler = (index) => {
    const toDoList = schedule.find((item) => item.idx === index);
    if (toDoList) {
      const toDoArray = [];
      toDoList.todo.map((item) =>
        toDoArray.push(<div key={Math.random()} className='list'>{item}</div>)
      );
      return toDoArray;
    }
  };

  const clickHandler = (index) => {
    dispatch(modalActions.toggle(index));
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = makeKey("prev", year, month, nowDate);
          thisMonthArray.push(
            <td key={idx} onClick={() => clickHandler(idx)}>
              {nowDate}
              <div>{scheduleHandler(idx)}</div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = makeKey("", year, month, nowDate);

          thisMonthArray.push(
            <td key={idx} onClick={() => clickHandler(idx)}>
              {nowDate}
              <div>{scheduleHandler(idx)}</div>
            </td>
          );
        }
      }
    } else {
      const startDate = (week - 1) * 7;
      for (let i = startDate; i <= week * 7 - 1; i++) {
        if (i - firstDay < lastDate) {
          const nowDate = i - firstDay + 1;
          const idx = makeKey("", year, month, nowDate);
          thisMonthArray.push(
            <td key={idx} onClick={() => clickHandler(idx)}>
              {nowDate}
              <div></div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = makeKey("next", year, month, nowDate);
          thisMonthArray.push(
            <td key={idx} onClick={() => clickHandler(idx)}>
              {nowDate}
              <div></div>
            </td>
          );
        }
      }
    }
    return thisMonthArray;
  };
  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  const week = Math.ceil((firstDay + lastDate) / 7);
  for (let i = 1; i <= week; i++) {
    monthArray.push(
      <tr key={i} className="week">
        {makeDay(i)}
      </tr>
    );
  }

  // console.log(monthArray);
  return monthArray;
};

export default MakeCaledner;
