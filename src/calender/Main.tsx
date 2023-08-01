import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AddEvent from "../modal/AddEvent";
import List from "../modal/List";
import AllList from "../modal/AllList";
import MakeCalender from "./MakeCalender";
import classes from "./Calender.module.css";



const date: Date = new Date();
const fixYear: number = date.getFullYear();
const fixMonth: number = date.getMonth() + 1;
const fixDate: number = date.getDate();

interface T {
  year: string;
  month: string;
  firstDay: number;
  lastDate: number;
  viewRef: React.RefObject<HTMLDivElement>;
}

const Main = ({ year, month, firstDay, lastDate, viewRef }: T) => {
  console.log("calender");

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);

  // month가 10월 달 보다 작으면 ex) 01, 02, 03... 으로 표기
  // data도 같은 원리.. 나중에 modalSlice에서 일정 추가 할 때, sort를 편하게 하기 위함.
  // 아래 identify는 makeCalender에서 현재 날짜에 파란 원이 생기게 끔 식별
  const identify: string =
    fixYear +
    "-" +
    fixMonth.toString().padStart(2, "0") +
    "-" +
    fixDate.toString().padStart(2, "0");

  const listRef = useRef({}); // makeCalender에서 list ref
  const allListRef = useRef({}); // makeCalender에서 all ref
  const clickedElement = useRef();
  const list = useRef(); // list모달창 ref

  useEffect(() => {
    listRef.current = {};
    allListRef.current = {};
  }, [month, data.userSchedule]);

  return (
    <main className={classes["calender-view"]}>
      <div className={classes.calender}>
        <table className={classes.table}>
          <thead className={classes.weekname}>
            <tr>
              <th>일</th>
              <th>월</th>
              <th>화</th>
              <th>수</th>
              <th>목</th>
              <th>금</th>
              <th>토</th>
            </tr>
          </thead>
          <tbody className={classes.presentation}>
            {MakeCalender({
              year,
              month,
              firstDay,
              lastDate,
              identify,
              listRef,
              allListRef,
              viewRef,
              clickedElement,
              data,
              modal,
            })}
          </tbody>
        </table>
        <div className={classes["modal-container"]}>
          {data.addModalOpen &&
            !modal.listModalOpen &&
            !modal.moreModalOpen && <AddEvent viewRef={viewRef} />}
          {!modal.listModalOpen && modal.moreModalOpen && (
            <AllList
              viewRef={viewRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
          {!data.addModalOpen && modal.listModalOpen && (
            <List
              viewRef={viewRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Main;
