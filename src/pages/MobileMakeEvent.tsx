import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { dateActions } from "../redux/date-slice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ListOrMore } from "../type/RefType";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { UserData } from "../type/ReduxType";
import { auth } from "../Auth/firebase";
import { sendUserData } from "../redux/fetch-action";
import { cloneActions } from "../redux/clone-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeDateArray } from "../utils/MakeLongArr";
import {
  faPenToSquare,
  faTrashCan,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { newMonth, newYear } from "../utils/nowDate";
import MobileTimePicker from "../ui/MobileTimePicker";
import SetTime from "../utils/Time/SetTime";
import SeconMonth from "../utils/miniCalender/Secon-Month";
import ColorBox from "../utils/Time/ColorBox";
import NotFound from "../error/NotFound";
import "./MobileMakeEvent.css";

const nowTime = SetTime();

const date = new Date().toISOString().split("T")[0];

const MakeEvent = () => {
  const param = useParams();
  const [parameter] = useSearchParams();
  const pickScheduleKey = parameter.get("key") ?? "";
  // key를 가지고 slice를 해서 date 찾아내야함..
  // 그리고 data.useschedule[date] = {startDate, endDate ... } 받아옴
  // 그 다음 데이터가 존재하지 않으면 404 페이지로 그리고, 존재하면 이벤트 컴포넌트 보이게하기 ㅇㅋ?
  const startDate = pickScheduleKey.slice(0, 10);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data);
  const clone = useSelector((state: RootState) => state.clone);
  const time = useSelector((state: RootState) => state.time);
  console.log("MakeEvent Mobile Render");

  const [openDate, setOpenDate] = useState<[boolean, string]>([false, ""]);
  const [openTime, setOpenTime] = useState<[boolean, string]>([false, ""]);
  const [color, setColor] = useState<string>(clone.color || "라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [existKey, setExistKey] = useState<boolean>(true);

  const dateRef = useRef<ListOrMore>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLSpanElement>(null);
  const endDateRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<HTMLSpanElement>(null);
  const endTimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 사용자 일정 정보를 받아오고 있거나, 일정 생성의 경우에 콜백 함수 실행 x
    if (data.isLoading) return;

    if (param["*"] === "event/make") {
      if (window.history.length === 0) {
        // 사용자가 만약 /caledner/event/make 경로로 페이지에 접근하는 경우
        navigate(`/caledner/date?year=${newYear}&month=${newMonth}`);
      } else {
        // history.legnth가 0이 아니면서 사용자가 make페이지에서 새로고침을 한 경우
        if (clone.startDate === "") navigate(-1);
      }
      return;
    }
    //...... 이후로 /event/edit 경로 ...........
    const scheduleData = data.userSchedule?.[startDate]?.[pickScheduleKey];

    if (!scheduleData) {
      // 해당 키의 데이터가 없는 경우, NotFound 페이지 표시
      setExistKey(false);
    }

    if (scheduleData && clone.startDate === "") {
      const [year, month] = startDate.split("-");
      const firstDay: number = new Date(+year, +month - 1, 1).getDay();
      const lastDate: number = new Date(+year, +month, 0).getDate();
      const week: number = Math.ceil((firstDay + lastDate) / 7); // 해당 month가 4주 ~ 5주인지?

      dispatch(
        cloneActions.setListInfo({
          ...data.userSchedule[startDate][pickScheduleKey],
          week,
          day: firstDay,
        })
      );
    }
  }, [dispatch, navigate, data, startDate, pickScheduleKey, param, clone]);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth > 500) {
        navigate(-1);
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  });

  let startTime = time.startTime || clone.startTime || nowTime.currentTime;
  let endTime = time.endTime || clone.endTime || nowTime.lastTime;

  const openHandler = (category: string, order: string) => {
    // cateogry => date or time && order => start or end

    if (category === "date") {
      setOpenTime([false, ""]);
      setOpenDate([
        openDate[1] === order ? false : true,
        openDate[1] === order ? "" : order,
      ]);
      const [startYear, startMonth] = clone.startDate.split("-");
      const [endYear, endMonth] = clone.endDate.split("-");

      dispatch(
        dateActions.setDate({
          year: order === "start" ? startYear : endYear,
          month: order === "start" ? startMonth : endMonth,
        })
      );
    } else {
      setOpenDate([false, ""]);
      setOpenTime([
        openTime[1] === order ? false : true,
        openTime[1] === order ? "" : order,
      ]);
    }
  };

  const deleteAndCreate = (type: string) => {
    const schedule = JSON.parse(JSON.stringify(data.userSchedule));
    let dateArray = makeDateArray(clone.startDate, clone.endDate);
    // 기존 항목 삭제 하고..

    if (param["*"] === "event/edit") {
      for (let date of dateArray) {
        delete schedule[date][clone.key];
      }
    }

    const parameter: MakeListParameter = {
      title:
        inputRef.current?.value || clone.title || inputRef.current!.placeholder,
      startDate: clone.startDate,
      endDate: clone.endDate,
      startTime,
      endTime,
      color,
      userSchedule: schedule,
    };

    // 새롭게 설정된 기간에 일정 생성 후에
    const newSchedule: UserData =
      type === "create" ? MakeList(parameter) : schedule;

    // 데이터 전송
    dispatch(
      sendUserData({ newSchedule, uid: auth.currentUser!.uid, type: "POST" })
    );
    console.log("delete And Create");
    navigate(-1);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (clone.startDate > clone.endDate) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }

    if (clone.startDate === clone.endDate) {
      if (startTime > endTime) {
        alert("종료 시간이 시작시간 보다 뒤에 있어야 합니다.");
        return;
      }
    }

    deleteAndCreate("create");
  };

  return (
    <div className="MakeEvent">
      {!existKey && <NotFound />}
      {window.innerWidth > 500 && (
        <div className="MakeEvent-announce">
          <div>
            <p>모바일 전용 페이지 입니다.</p>
            <button onClick={() => navigate(-1)}>뒤로 가기</button>
          </div>
        </div>
      )}
      {data.succesGetScheduleData && existKey && window.innerWidth <= 500 && (
        <form className="Make-Form" onSubmit={submitHandler}>
          <div className="X-mark">
            <div onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <label htmlFor="title"></label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder={clone.title || "제목 없음"}
            ref={inputRef}
          />
          <ColorBox
            platform={"mobile"}
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
          />
          <div className="fa-clock">
            <FontAwesomeIcon icon={faClock} className="Make-clock-icon" />
          </div>
          {data.succesGetScheduleData && (
            <div className="Make-time">
              <div className="time">
                <div
                  className={openDate[1] === "start" ? "clicked" : ""}
                  onTouchEnd={() => openHandler("date", "start")}
                >
                  <span ref={startDateRef}>{clone.startDate || date}</span>
                </div>
                <div
                  className={openTime[1] === "start" ? "clicked" : ""}
                  onTouchEnd={() => openHandler("time", "start")}
                >
                  <span ref={startTimeRef}>{startTime}</span>
                </div>
              </div>
              <div className="arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div className="time">
                <div
                  className={openDate[1] === "end" ? "clicked" : ""}
                  onTouchEnd={() => openHandler("date", "end")}
                >
                  <span ref={endDateRef}>{clone.endDate || date}</span>
                </div>
                <div
                  className={openTime[1] === "end" ? "clicked" : ""}
                  onTouchEnd={() => openHandler("time", "end")}
                >
                  <span ref={endTimeRef}>{endTime}</span>
                </div>
              </div>
            </div>
          )}
          <div className="picker-box">
            {openDate[0] && (
              <SeconMonth
                platform="mobile"
                type={openDate[1]}
                dateRef={dateRef}
              />
            )}
            {openTime[0] && (
              <MobileTimePicker
                type={openTime[1]}
                startTime={startTime}
                endTime={endTime}
              />
            )}
          </div>
          <div className="button-container">
            {param["*"] === "event/edit" && (
              <button
                className="mobile-button"
                type="button"
                onTouchEnd={() => deleteAndCreate("delete")}
                style={{ width: param["*"] === "event/edit" ? "50%" : "0" }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>삭제</span>
              </button>
            )}
            <button
              className="mobile-button"
              type="submit"
              style={{ width: param["*"] === "event/make" ? "100%" : "50%" }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>생성</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MakeEvent;
