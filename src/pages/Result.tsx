import React, { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { CalenderData } from "../type/ReduxType";
import { modalActions } from "../redux/modal-slice";
import { cloneActions } from "../redux/clone-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import Header from "../calender/header/Header";
import ModalContainer from "../modal/ModalContainer";
import "./Result.css";

const Result = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const keyword = param.get("result");

  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const modal = useSelector((state: RootState) => state.modal);

  const viewRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const clickedElement = useRef<HTMLDivElement | null>(null);

  let result: { [key: string]: CalenderData[] } = {};

  for (let date in schedule) {
    for (let key in schedule[date]) {
      if (schedule[date][key].title === keyword) {
        if (!result[date]) result[date] = [];
        result[date] = [...result[date], schedule[date][key]];
      }
    }
  }

  const listClickHandler = (
    object: CalenderData,
    index: number,
    secondIndex: number
  ) => {
    let offsetTop =
      listsRef.current[object.key + index + secondIndex]!.offsetTop;
    let scrollTop = viewRef.current!.scrollTop;

    if (offsetTop - scrollTop > window.innerHeight / 2)
      offsetTop = Math.ceil(offsetTop - scrollTop - 150);
    else offsetTop = Math.ceil(offsetTop - scrollTop);

    dispatch(cloneActions.setListInfo({ type: "List", ...object, index }));

    if (window.innerWidth > 500) {
      dispatch(
        modalActions.setListInfo({ type: "List", ...object, index, offsetTop })
      );
      dispatch(modalActions.onModal({ type: "List" }));
    } else {
      navigate(`/calender/event/edit?key=${object.key}`);
    }
  };

  const keyArray = Object.keys(result);
  return (
    <>
      <Header type="search" />
      <main className="result-container" ref={viewRef}>
        <div className="result-box">
          {keyArray.length === 0 && (
            <div className="result-not-found">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
          {keyArray.length !== 0 && (
            <ul>
              {keyArray.map((date, index) => (
                <li className="result-list" key={index}>
                  <div className="r-l-1">
                    <span>{+date.split("-")[2]}</span>
                  </div>
                  <div className="r-l-2">
                    <span>{date}</span>
                  </div>
                  <div className="r-l-3">
                    {result[date].map((item, idx) => (
                      <div
                        className={`items ${
                          modal.key === item.key && "picked"
                        }`}
                        key={item.key}
                        ref={(el: HTMLDivElement) =>
                          (listsRef.current[item.key + index + idx] = el)
                        }
                        onClick={() => listClickHandler(item, index, idx)}
                        onTouchEnd={() => listClickHandler(item, index, idx)}
                      >
                        <div className="mobile-r-l-1">
                          <FontAwesomeIcon icon={faCalendarDays} />
                        </div>
                        <div className={`color-circle ${item.color}`}></div>
                        <div className="list-times">
                          <span>
                            {item.startTime}&nbsp;&nbsp;~&nbsp;&nbsp;
                            {item.endTime}
                          </span>
                        </div>
                        <div className="list-title">
                          <span>{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ModalContainer
          type="Search"
          lastweek={5}
          viewRef={viewRef}
          listsRef={listsRef}
          clickedElement={clickedElement}
        />
      </main>
    </>
  );
};

export default Result;
