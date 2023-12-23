import React from "react";
import { ListOrMore } from "../type/RefType";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { auth } from "../Auth/firebase";
import MakeEvent from "./MakeEvent";
import List from "./List";
import MoreList from "./MoreList";
import MobileModal from "./MoblieModal";
import "./Modal.css";

interface T {
  lastweek: number;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  list: React.RefObject<HTMLDivElement>;
  moreModalRef: React.MutableRefObject<HTMLDivElement | null>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContainer = ({
  lastweek,
  viewRef,
  listRef,
  allListRef,
  list,
  moreModalRef,
  clickedElement,
  setIsDragging,
}: T) => {
  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);
  const clone = useSelector((state: RootState) => state.clone);

  return (
    <div
      className={`modal-container ${
        (modal.addModalOpen || modal.listModalOpen || modal.moreModalOpen) &&
        "modal-open"
      }`}
    >
      {modal.addModalOpen && (
        <MakeEvent
          data={data}
          lastweek={lastweek}
          uid={auth.currentUser!.uid}
          viewRef={viewRef}
          setIsDragging={setIsDragging}
        />
      )}
      {modal.moreModalOpen && (
        <MoreList
          data={data}
          modal={modal}
          lastweek={lastweek}
          viewRef={viewRef}
          moreModalRef={moreModalRef}
          allListRef={allListRef}
          clickedElement={clickedElement}
          list={list}
        />
      )}
      {modal.listModalOpen && (
        <List
          data={data}
          modal={modal}
          clone={clone}
          lastweek={lastweek}
          viewRef={viewRef}
          listRef={listRef}
          clickedElement={clickedElement}
          list={list}
          uid={auth.currentUser!.uid}
          setIsDragging={setIsDragging}
          // moreModalRef={moreModalRef}
          // allListRef={allListRef}
        />
      )}
      {modal.mobileModalOpen && window.innerWidth <= 500 && (
        <MobileModal data={data} modal={modal} clone={clone} />
      )}
    </div>
  );
};

export default ModalContainer;
