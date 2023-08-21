import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ListOrMore } from "../type/RefType";
import { auth } from "../Auth/firebase";
import MakeEvent from "../modal/MakeEvent";
import List from "../modal/List";
import MoreList from "../modal/MoreList";
import MakeCalender from "./MakeCalender";
import CloneList from "./CloneList";
import classes from "./MakeCalender.module.css";

interface T {
  year: string;
  month: string;
  list: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
}

const Main = ({
  year,
  month,
  list,
  listRef,
  allListRef,
  clickedElement,
}: T) => {
  console.log("Main");

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);
  // const [고정좌표, 고정좌표설정] = useState<[string, string]>(["", ""]);
  // const [실시간좌표, 실시간좌표설정] = useState<[string, string]>(["", ""]);

  const viewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();
  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

  useEffect(() => {
    listRef.current = {};
    allListRef.current = {};
  }, [month, data, listRef, allListRef]);

  // const mouseDown = (e: React.MouseEvent) => {
  //   setIsDragging(true);
  //   // 고정좌표.current = { x: e.pageX, y: e.pageY };
  // };

  // const mouseMove = (e: React.MouseEvent) => {
  //   if (!isDragging) return;
  //   // 실시간좌표.current = { x: e.pageX, y: e.pageY };
  //   document.body.style.cursor = "move";
  // };

  // const mouseUp = (e: React.MouseEvent) => {
  //   setIsDragging(false);
  //   document.body.style.cursor = "auto";
  // };

  return (
    <main className={classes["calender-view"]}>
      <div
        className={classes.calender}
        ref={viewRef}
      >
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
              week,
              firstDay,
              lastDate,
              isDragging,
              setIsDragging,
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
            !modal.moreModalOpen && (
              <MakeEvent viewRef={viewRef} uid={auth.currentUser!.uid} />
            )}
          {!modal.listModalOpen && modal.moreModalOpen && (
            <MoreList
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
              uid={auth.currentUser!.uid}
            />
          )}
        </div>
      </div>
      {isDragging && <CloneList
        year={year}
        month={month}
        modal={modal}
        firstDay={firstDay}
        lastDate={lastDate}
        lastWeek={week}
        setIsDragging={setIsDragging}
      />}
    </main>
  );
};

export default Main;
