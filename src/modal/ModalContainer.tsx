import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { auth } from "../auth/firebase";
import MakeEvent from "./MakeEvent";
import List from "./List";
import MoreList from "./MoreList";
import MobileModal from "./MoblieModal";
import "./Modal.css";

interface T {
  type: string;
  lastweek: number;
  viewRef: React.RefObject<HTMLDivElement>;
  listsRef?: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  allListRef?: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContainer = ({
  type,
  lastweek,
  viewRef,
  listsRef,
  allListRef,
  clickedElement,
  setIsDragging,
}: T) => {
  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);
  const clone = useSelector((state: RootState) => state.clone);

  const list = useRef<HTMLDivElement>(null); // list모달창 ref
  const moreModalRef = useRef<HTMLDivElement>(null); // 더 보기 모달창에 사용할 ref

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
          setIsDragging={setIsDragging!}
        />
      )}
      {modal.moreModalOpen && (
        <MoreList
          data={data}
          modal={modal}
          lastweek={lastweek}
          viewRef={viewRef}
          moreModalRef={moreModalRef}
          list={list}
          allListRef={allListRef!}
          clickedElement={clickedElement}
        />
      )}
      {modal.listModalOpen && (
        <List
          type={type}
          data={data}
          modal={modal}
          clone={clone}
          lastweek={lastweek}
          viewRef={viewRef}
          listsRef={listsRef}
          clickedElement={clickedElement}
          list={list}
          uid={auth.currentUser!.uid}
          setIsDragging={setIsDragging}
        />
      )}
      {modal.mobileModalOpen && window.innerWidth <= 500 && (
        <MobileModal data={data} clone={clone} />
      )}
    </div>
  );
};

export default ModalContainer;
