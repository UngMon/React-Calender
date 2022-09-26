import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
// import { sendScheduleData } from "../store/fetch-action";
import ModalPosition from "../library/ModalPosition";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const List = () => {
  const dispatch = useDispatch();
  const listState = useSelector((state) => state.list);
  const modalState = useSelector((state) => state.modal);
  const [listIsVisible, setListIsVisible] = useState(false);

  const removeListHandler = (listIndex, index) => {
    dispatch(modalActions.removeList({ listIndex, index }));
    dispatch(listActions.toggle());
  };

  const listVisivleHandler = () => {
    setListIsVisible(true);
  };

  const listDoneHandler = (index, listIndex) => {
    dispatch(modalActions.listDone({ index, listIndex }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.toggle());
  };

  const styleClass =
    modalState.schedule[listState.index].todo[listState.listIndex].style &&
    !listIsVisible &&
    "done";

  return (
    <div
      className={`list-box ${ModalPosition(
        listState.dayIndex,
        listState.week
      )}`}
    >
      <div className="option-box">
        <div onClick={listVisivleHandler}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div
          onClick={() =>
            removeListHandler(listState.listIndex, listState.index)
          }
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div
          className="fa-check"
          onClick={() => listDoneHandler(listState.index, listState.listIndex)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="fa-xmark" onClick={closeModalHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      <div className="list-area">
        {listIsVisible && (
          <input placeholder={listState.listName} type="text" />
        )}
        {!listIsVisible && (
          <div className={`listName  ${styleClass}`}>{listState.listName}</div>
        )}
      </div>
    </div>
  );
};

export default List;
