import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import classes from "./List.module.css";

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
    <div className={classes["list-box"]}>
      <div className={classes["option-box"]}>
        <div className={classes.edit} onClick={listVisivleHandler}>
          수정
        </div>
        <div
          className={classes.remove}
          onClick={() => removeListHandler(listInfo.listIndex, listInfo.index)}
        >
          삭제
        </div>
        <div className={classes.done}>완료</div>
        <div onClick={closeModalHandler}>닫기</div>
      </div>
      {listIsVisible && <input placeholder={listInfo.listName} type="text" />}
      {!listIsVisible && <div className={classes.listName}>{listInfo.listName}</div>}
    </div>
  );
};

export default List;
