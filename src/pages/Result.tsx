import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CalenderData } from "../type/ReduxType";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Header from "../calender/header/Header";
import "./Result.css";

const Result = () => {
  const [param] = useSearchParams();
  const schedule = useSelector((state: RootState) => state.data.userSchedule);
  const keyword = param.get("result");
  let result: { [key: string]: CalenderData[] } = {};

  for (let date in schedule) {
    for (let key in schedule[date]) {
      if (schedule[date][key].title === keyword) {
        if (!result[date]) result[date] = [];
        result[date] = [...result[date], schedule[date][key]];
      }
    }
  }
  console.log(result);
  const keyArray = Object.keys(result);
  return (
    <>
      <Header type="search" />
      <div className="result-page">
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
                  {result[date].map((item) => (
                    <div className="items" key={item.key}>
                      <div>
                        <span>
                          {item.startTime}&nbsp;&nbsp;~&nbsp;&nbsp;
                          {item.endTime}
                        </span>
                      </div>
                      <div>
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
    </>
  );
};

export default Result;
