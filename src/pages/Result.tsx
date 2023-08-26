import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CalenderData } from "../type/ReduxType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Result.css";
import Header from "../calender/header/Header";

const Result = () => {
  const [param] = useSearchParams();
  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const keyword = param.get("result");
  let result: CalenderData[] = [];

  for (let date in schedule) {
    for (let key in schedule[date]) {
      if (schedule[date][key].title === keyword)
        result.push(schedule[date][key]);
    }
  }

  return (
    <>
      <Header type="search" />
      <div className="result-page">
        {result.length === 0 && (
          <div className="result-not-found">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
        {result.length !== 0 && (
          <ul>
            {result.map((item) => (
              <li className="result-list">
                <div>
                  <span>{item.startDate.split("-")[2]}</span>
                </div>
                <div>
                  <span>{item.startDate}</span>
                </div>
                <div>
                  <span>{item.startTime + "~" + item.endTime}</span>
                </div>
                <div>
                  <span>{item.title}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Result;
