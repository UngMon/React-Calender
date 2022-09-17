import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import './AllList.css';

const AllList = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.modal.schedule);
  const allModal = useSelector((state) => state.all);
  console.log(allModal);

  const makeListHandler = () => {
    return schedule[allModal.index].todo.map((item, index) => (<li key={index} className="item-list">{item}</li>));
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
    <div className={`all-list week-${allModal.week} day-${allModal.day}`}>
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
