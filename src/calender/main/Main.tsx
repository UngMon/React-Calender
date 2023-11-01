import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ListOrMore } from "../../type/RefType";
import { auth } from "../../Auth/firebase";
import CalenderSlide from "./CalenderSlide";
import MakeEvent from "../../modal/MakeEvent";
import List from "../../modal/List";
import MoreList from "../../modal/MoreList";
import CloneList from "../CloneList";
import MobileModal from "../../modal/MoblieModal";
import style from "../Calender.module.css";

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
  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);

  const viewRef = useRef<HTMLDivElement>(null);
  const moreModalRef = useRef<HTMLDivElement | null>(null);
  const clicekdMoreRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();
  const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

  useEffect(() => {
    listRef.current = {};
    allListRef.current = {};
  }, [month, data, listRef, allListRef]);

  return (
    <main className={style["calender-view"]}>
      <div className={style.calender} ref={viewRef}>
        <CalenderSlide
          data={data}
          modal={modal}
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
        <div className={style["modal-container"]}>
          {modal.addModalOpen && (
            <MakeEvent
              data={data}
              week={week}
              uid={auth.currentUser!.uid}
              viewRef={viewRef}
              setIsDragging={setIsDragging}
            />
          )}
          {modal.moreModalOpen && (
            <MoreList
              viewRef={viewRef}
              moreModalRef={moreModalRef}
              listRef={listRef}
              allListRef={allListRef}
              clickedElement={clickedElement}
              list={list}
            />
          )}
          {modal.listModalOpen && (
            <List
              week={week}
              viewRef={viewRef}
              moreModalRef={moreModalRef}
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
      {(window.innerWidth <= 500 && modal.mobileModalOpen) && (
        <MobileModal data={data} />
      )}
    </main>
  );
};

export default Main;
