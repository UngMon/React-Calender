import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ListOrMore, TableRef } from "../type/RefType";
import { auth } from "../Auth/firebase";
import MakeEvent from "../modal/MakeEvent";
import List from "../modal/List";
import MoreList from "../modal/MoreList";
import MakeCalender from "./MakeCalender";
import CloneList from "./CloneList";
import MobileModal from "../modal/MoblieModal";
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

  const viewRef = useRef<HTMLDivElement>(null);
  const weekRef = useRef<TableRef>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();
  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

  useEffect(() => {
    listRef.current = {};
    allListRef.current = {};
  }, [month, data, listRef, allListRef]);
  
  return (
    <main className={classes["calender-view"]}>
      <div className={classes.calender} ref={viewRef}>
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
          <MakeCalender
            data={data}
            modal={modal}
            year={year}
            month={month}
            week={week}
            firstDay={firstDay}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            weekRef={weekRef}
            listRef={listRef}
            allListRef={allListRef}
            clickedElement={clickedElement}
            // listBoxHeightCount={listBoxHeightCount}
          />
        </table>
        <div className={classes["modal-container"]}>
          {modal.addModalOpen && (
            <MakeEvent
              viewRef={viewRef}
              uid={auth.currentUser!.uid}
              setIsDragging={setIsDragging}
              data={data}
              modal={modal}
            />
          )}
          {modal.moreModalOpen && (
            <MoreList
              viewRef={viewRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
          {modal.listModalOpen && (
            <List
              weekRef={weekRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
              uid={auth.currentUser!.uid}
              data={data}
              modal={modal}
              setIsDragging={setIsDragging}
            />
          )}
        </div>
      </div>
      {isDragging && (
        <CloneList
          year={year}
          month={month}
          data={data}
          modal={modal}
          firstDay={firstDay}
          lastWeek={week}
          uid={auth.currentUser!.uid}
          setIsDragging={setIsDragging}
          clickedElement={clickedElement}
          viewRef={viewRef}
        />
      )}
      {window.innerWidth <= 500 && modal.mobileModalOpen && (
        <MobileModal data={data} modal={modal} />
      )}
    </main>
  );
};

export default Main;
