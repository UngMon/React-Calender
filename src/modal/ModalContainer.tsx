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
  week: number;
  viewRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<ListOrMore>;
  allListRef: React.MutableRefObject<ListOrMore>;
  list: React.RefObject<HTMLDivElement>;
  moreModalRef: React.MutableRefObject<HTMLDivElement | null>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContainer = ({
  week,
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
      {modal.mobileModalOpen && window.innerWidth <= 500 && (
        <MobileModal data={data} modal={modal} clone={clone} />
      )}
    </div>
  );
};

export default ModalContainer;
