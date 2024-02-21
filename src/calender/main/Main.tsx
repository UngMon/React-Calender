import React, { useEffect, useRef } from "react";
import CalenderSlide from "./CalenderSlide";
import ModalContainer from "../../modal/ModalContainer";
import CloneList from "../CloneList";
import style from "../Calender.module.css";

interface T {
  year: string;
  month: string;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

let isMount = true;

const Main = ({ year, month, isDragging, setIsDragging }: T) => {

  const viewRef = useRef<HTMLDivElement>(null);  
  const listsRef = useRef<{ [key: string]: HTMLDivElement | null }>({}); // makeCalender에서 list ref
  const allListRef = useRef<{ [key: string]: HTMLDivElement | null }>({}); // makeCalender에서 all ref
  const clickedElement = useRef<HTMLDivElement>(null); // 사용자가 클릭한 요소를 담을 ref
  const clicekdMoreRef = useRef<HTMLDivElement>(null); // 사용자가 클릭한 더 보기 요소 

  const firstDay: number = new Date(+year, +month - 1, 1).getDay(); // 해당 달의 첫째 날 요일
  const lastDate: number = new Date(+year, +month, 0).getDate(); // 보고있는 달의 마지막 날
  const lastWeek: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?
  
  useEffect(() => {
    if (isMount) {
      isMount = false;
      return;
    }

    listsRef.current = {};
    allListRef.current = {};
  }, [month, listsRef, allListRef]);

  return (
    <main className={style["calender-view"]}>
      <div className={style.calender} ref={viewRef}>
        <CalenderSlide
          year={year}
          month={month}
          week={lastWeek}
          firstDay={firstDay}
          setIsDragging={setIsDragging}
          viewRef={viewRef}
          listsRef={listsRef}
          allListRef={allListRef}
          clicekdMoreRef={clicekdMoreRef}
        />
      </div>
      <ModalContainer
        type="None"
        lastweek={lastWeek}
        viewRef={viewRef}
        listsRef={listsRef}
        allListRef={allListRef}
        clickedElement={clickedElement}
        setIsDragging={setIsDragging}
      />
      {isDragging && (
        <CloneList
          year={year}
          month={month}
          firstDay={firstDay}
          lastWeek={lastWeek}
          setIsDragging={setIsDragging}
          clickedElement={clickedElement}
        />
      )}
    </main>
  );
};

export default Main;
