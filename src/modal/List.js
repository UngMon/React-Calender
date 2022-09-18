import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/listmodal-slice";
import { modalActions } from "../store/modal-slice";
import ModalPosition from "./ModalPosition";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";

const List = () => {
  const dispatch = useDispatch();
  const listInfo = useSelector((state) => state.list);
  const [listIsVisible, setListIsVisible] = useState(false);

  const removeListHandler = (listIndex, index) => {
    dispatch(modalActions.removeList({ listIndex, index }));
    dispatch(listActions.toggle());
  };

  const listVisivleHandler = () => {
    setListIsVisible(true);
  };

  const closeModalHandler = () => {
    dispatch(listActions.toggle());
  };

  return (
    <div
      className={`list-box ${ModalPosition(listInfo.dayIndex, listInfo.week)}`}
    >
      <div className="option-box">
        <div onClick={listVisivleHandler}>
          <FontAwesomeIcon icon={faEdit}/>
        </div>
        <div
          onClick={() => removeListHandler(listInfo.listIndex, listInfo.index)}
        >
          <FontAwesomeIcon icon={faTrash}/>
        </div>
        <div className="fa-check">
          <FontAwesomeIcon icon={faCheck}/>
        </div>
        <div className="fa-xmark" onClick={closeModalHandler}>
          <FontAwesomeIcon icon={faXmark}/>
        </div>
      </div>
      <div className="list-area">
        {listIsVisible && <input placeholder={listInfo.listName} type="text" />}
        {!listIsVisible && <div className="listName">{listInfo.listName}</div>}
      </div>
    </div>
  );
};

export default List;
