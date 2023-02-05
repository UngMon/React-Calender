import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AddEvent from "../modal/AddEvent";
import List from "../modal/List";
import AllList from "../modal/AllList";
import classes from "./Calender.module.css";
import MakeCaledner from "./MakeCalender";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = date.getMonth() + 1;
const fixDate = date.getDate();

const Calender = ({ year, month, firstDay, lastDate, scheduleInfo, viewRef }) => {
  console.log("calender");

  const addModal = useSelector((state) => state.modal);
  const listModal = useSelector((state) => state.list);
  const allListModal = useSelector((state) => state.all);
  // 아래 identify는 makeCalender에서 현재 날짜에 파란 원이 생기게 끔 식별
  const identify = fixYear + "-" + fixMonth + "-" + fixDate;

  const listRef = useRef({}); // makeCalender에서 list ref
  const allListRef = useRef({}); // makeCalender에서 all ref
  const clickedElement = useRef();
  const list = useRef(); // list모달창 ref

  useEffect(() => {
    listRef.current = {};
    allListRef.current = {};
  }, [month, scheduleInfo]);

  return (
    <main className={classes["calender-view"]}>
      <div className={classes.calender}>
        <table className={classes.table}>
          <thead className={classes.weekname}>
            <tr>
              <th dayindex="0">일</th>
              <th dayindex="1">월</th>
              <th dayindex="2">화</th>
              <th dayindex="3">수</th>
              <th dayindex="4">목</th>
              <th dayindex="5">금</th>
              <th dayindex="7">토</th>
            </tr>
          </thead>
          <tbody className={classes.presentation}>
            {MakeCaledner({
              year,
              month,
              firstDay,
              lastDate,
              identify,
              listRef,
              allListRef,
              viewRef,
              clickedElement,
            })}
          </tbody>
        </table>
        <div className={classes["modal-container"]}>
          {!addModal.isVisible && allListModal.isVisible && (
            <AllList
              viewRef={viewRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
        </div>
        <div className={classes["modal-container"]}>
          {!addModal.isVisible && listModal.isVisible && (
            <List
              viewRef={viewRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
        </div>
        <div className={classes["modal-container"]}>
          {addModal.isVisible &&
            !listModal.isVisible &&
            !allListModal.isVisible && <AddEvent viewRef={viewRef} />}
        </div>
      </div>
    </main>
  );
};

export default Calender;
