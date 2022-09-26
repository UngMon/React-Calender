import { useDispatch, useSelector } from "react-redux";
import { allListActions } from "../store/all-list-slice";
import "./AllList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AllList = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.modal.schedule);
  const allModal = useSelector((state) => state.all);
  console.log(allModal);

  const makeListHandler = () => {
    return schedule[allModal.index].todo.map((item, listIndex) => (
      <li
        key={item.firstTime + " " + item.lastTime + listIndex}
        className="item-list"
      >
        {item.firstTime + " " + item.list}
      </li>
    ));
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
    <div className={`all-list li-week-${allModal.week} li-day-${allModal.day}`}>
      <div className="header-list-box">
        <h2>{dayChangeHandler()}</h2>
        <button onClick={cancelHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <h3 className="list-box-date">{allModal.date}</h3>
      <div className="main-list-box">
        <div>
          <ul>{makeListHandler()}</ul>
        </div>
      </div>
    </div>
  );
};

export default AllList;
