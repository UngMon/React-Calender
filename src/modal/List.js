import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import classes from "./List.module.css";

const List = () => {
  const dispatch = useDispatch();
  const listInfo = useSelector((state) => state.list);

  const removeListHandler = (listIndex, index) => {
    dispatch(modalActions.removeList({ listIndex, index }));
    dispatch(listActions.toggle());
  };

  return (
    <div className={classes["list-box"]}>
      <div>수정</div>
      <div
        onClick={() => removeListHandler(listInfo.listIndex, listInfo.index)}
      >
        삭제
      </div>
      <div>완료</div>
      <input placeholder={listInfo.listName} type="text" />
      <div className={classes["button-box"]}>
        <button>완료</button>
        <button>취소</button>
      </div>
    </div>
  );
};

export default List;
