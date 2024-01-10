import React, { useEffect, useState, useRef } from "react";
import { ListOrMore } from "../../type/RefType";
import CalenderSlide from "./CalenderSlide";
import ModalContainer from "../../modal/ModalContainer";
import CloneList from "../CloneList";
import style from "../Calender.module.css";

interface T {
  year: string;
  month: string;
}

let isMount = true;

const Main = ({ year, month }: T) => {
  console.log("Main => CalenderSlide");

  const listRef = useRef<ListOrMore>({}); // makeCalender에서 list ref
  const allListRef = useRef<ListOrMore>({}); // makeCalender에서 all ref
  const clickedElement = useRef<HTMLDivElement | null>(null);
  const list = useRef<HTMLDivElement>(null); // list모달창 ref
  const viewRef = useRef<HTMLDivElement>(null);
  const moreModalRef = useRef<HTMLDivElement | null>(null);
  const clicekdMoreRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();

  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

  useEffect(() => {
    if (isMount) {
      isMount = false;
      return;
    }
    listRef.current = {};
    allListRef.current = {};
  }, [month, listRef, allListRef]);

  return (
    <main className={style["calender-view"]}>
      <div className={style.calender} ref={viewRef}>
        <CalenderSlide
          year={year}
          month={month}
          week={week}
          firstDay={firstDay}
          setIsDragging={setIsDragging}
          viewRef={viewRef}
          listRef={listRef}
          allListRef={allListRef}
          clicekdMoreRef={clicekdMoreRef}
        />
      </div>
      <ModalContainer
        lastweek={week}
        viewRef={viewRef}
        listRef={listRef}
        allListRef={allListRef}
        list={list}
        moreModalRef={moreModalRef}
        clickedElement={clickedElement}
        setIsDragging={setIsDragging}
      />
      {isDragging && (
        <CloneList
          year={year}
          month={month}
          firstDay={firstDay}
          lastWeek={week}
          setIsDragging={setIsDragging}
          clickedElement={clickedElement}
          viewRef={viewRef}
        />
      )}
    </main>
  );
};

export default Main;
