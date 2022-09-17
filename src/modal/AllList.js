import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";

const AllList = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.modal.schedule);
  const listModal = useSelector(state => state.list);
  const allModal = useSelector((state) => state.all);

  const makeListHandler = () => {
    return schedule[allModal.index].todo.map((item) => (<li className="item-list">{item}</li>));
  };

  const cancelHandler = () => {
    dispatch(allListActions.toggle());
  };

  const dayChangeHandler = () => {
    return allModal.day === 1
      ? "일"
      : allModal.day === 2
      ? "월"
      : allModal.day === 3
      ? "화"
      : allModal.day === 4
      ? "수"
      : allModal.day === 5
      ? "목"
      : allModal.day === 6
      ? "금"
      : "토";
  };

  return (
    <div className={`AllList week-${listModal.week} day-${listModal.dayIndex}`}>
      <div className="header-list-box">
        <h2>{dayChangeHandler()}</h2>
        <button onClick={cancelHandler}>닫기</button>
      </div>
      <h3>{allModal.date}</h3>
      <div className="main-list-box">
        <ul>{makeListHandler()}</ul>
      </div>
    </div>
  );
};

export default AllList;
