import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ButtonRef } from "../../type/RefType";
import { cloneActions } from "../../redux/clone-slice";
import style from "./miniCal.module.css";

interface T {
  type: string;
  year: string;
  month: string;
  identify: string;
  dateRef: React.MutableRefObject<ButtonRef>;
}

const MakeCaledner = ({ type, year, month, identify, dateRef }: T) => {

  const dispatch = useDispatch();
  const clone = useSelector((state: RootState) => state.clone);
  const firstDay = new Date(+year, +month - 1, 1).getDay();
  const lastDate = new Date(+year, +month, 0).getDate();
  // UTC기준 해당 달의 1일이 되는 시간
  const dayOneTime = new Date(year + "-" + month + "-01").getTime();

  const clickHandler = (date: string, day: number, week: number) => {
    let startDate: string = type === "start" ? date : clone.startDate;
    let endDate: string = type === "end" ? date : clone.endDate;

    dispatch(
      cloneActions.clickedDate({
        type,
        startDate,
        endDate,
        day: String(day),
        week: String(week),
      })
    );
  };

  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  const week = Math.ceil((firstDay + lastDate) / 7);

  return (
    <>
      {Array.from({ length: week }, (_, index) => index + 1).map((주) => {
        let move: number;
        if (주 === 1) move = -24 * 60 * 60 * 1000 * (firstDay + 1);
        else move = 24 * 60 * 60 * 1000 * ((주 - 2) * 7 + (6 - firstDay));

        return (
          <tr
            key={주}
            className={style["week-box"]}
            ref={(el) => (dateRef.current![주 + 3] = el)}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((d) => {
              let next: number = d * 24 * 60 * 60 * 1000;
              const date = new Date(dayOneTime + move + next)
                .toISOString()
                .split("T")[0];

              const 일 = date.split("-")[2];

              return (
                <td
                  key={date}
                  onClick={() => clickHandler(date, d, 주)}
                  className={style.date_box}
                >
                  <div>
                    <p
                      className={`${d === 1 && style["sunday"]} ${
                        d === 7 && style["saturday"]
                      } ${identify === date && style["Today"]} ${
                        date === clone.startDate &&
                        type === "start" &&
                        style["startDate"]
                      } ${
                        date === clone.endDate &&
                        type === "end" &&
                        style["endDate"]
                      }`}
                    >
                      {일}
                    </p>
                  </div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

export default MakeCaledner;
