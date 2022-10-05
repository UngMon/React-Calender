import MakeKey from "../MakeKey";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import classes from './second.module.css'

const DatePicker = ({ year, month, firstDay, lastDate, identify }) => {
  const dispatch = useDispatch();
  
  const monthInfo = useSelector((state) => state.month);

  const addClickHandler = (idx, dayIndex, week, month, date) => {
    if (!modalinfo.isVisible) {
      dispatch(modalActions.clickedData({ idx, dayIndex, week, month, date }));
    }
    dispatch(modalActions.onModal());
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeKey("prev", year, month, nowDate);
          const dayIdx = `day-${i}`; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week, month, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = `day-${i}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => addClickHandler(idx, i, week, month, nowDate)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
            </td>
          );
        }
      }
    } else {
      const startDate = (week - 1) * 7;

      for (let i = startDate; i <= week * 7 - 1; i++) {
        if (i - firstDay < lastDate) {
          const nowDate = i - firstDay + 1;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() =>
                addClickHandler(idx, (i % 7) + 1, week, month, nowDate)
              }
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeKey("next", year, month, nowDate);
          const dayIdx = `day-${(i % 7) + 1}`;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() =>
                addClickHandler(idx, (i % 7) + 1, week, month, nowDate)
              }
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
              >
                {nowDate}
              </div>
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
      <tr key={i} className={classes.list_box} weekindex={i}>
        {makeDay(i)}
      </tr>
    );
  }

  return monthArray;
};

export default DatePicker;
