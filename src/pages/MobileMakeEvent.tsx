import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { makeList } from "../utils/makeList";
import { MakeListParameter } from "../type/Etc";
import { UserData } from "../type/ReduxType";
import { auth } from "../auth/firebase";
import { sendUserData } from "../redux/fetch-action";
import { cloneActions } from "../redux/clone-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { makeDateArray } from "../utils/makedateArray";
import {
  faPenToSquare,
  faTrashCan,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { newMonth, newYear } from "../utils/nowDate";
import { setTime } from "../ui/time/SetTime";
import ColorBox from "../ui/time/ColorBox";
import NotFound from "./NotFound";
import PickerBox from "../ui/time/PickerBox";
import "./MobileMakeEvent.css";

const nowTime = setTime();

const date = new Date().toISOString().split("T")[0];

const MakeEvent = () => {
  const param = useParams();
  const [parameter] = useSearchParams();
  const pickScheduleKey = parameter.get("key") ?? "";

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data);
  const clone = useSelector((state: RootState) => state.clone);
  const startDate = clone.startDate || pickScheduleKey?.slice(0, 10) || date;
  const endDate = clone.endDate || date;
  
  const [openDate, setOpenDate] = useState<[boolean, string]>([false, ""]);
  const [openTime, setOpenTime] = useState<[boolean, string]>([false, ""]);
  const [color, setColor] = useState<string>(clone.color || "라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [existKey, setExistKey] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const timeIputOneRef = useRef<HTMLInputElement>(null);
  const timeInputTwoRef = useRef<HTMLInputElement>(null);

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

  let startTime = clone.startTime || nowTime.currentTime;
  let endTime = clone.endTime || nowTime.lastTime;

  const deleteAndCreate = (
    type: string,
    startTime: string,
    endTime: string
  ) => {
    const schedule = JSON.parse(JSON.stringify(data.userSchedule));
    let dateArray = makeDateArray(clone.startDate, clone.endDate);
    // 기존 항목 삭제 하고..

    if (param["*"] === "event/edit") {
      for (let date of dateArray) {
        delete schedule?.[date]?.[clone.key];
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
      type === "create" ? makeList(parameter) : schedule;

    // 데이터 전송
    dispatch(
      sendUserData({ newSchedule, uid: auth.currentUser!.uid, type: "POST" })
    );
    navigate(-1);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (clone.startDate > clone.endDate) {
      alert("종료 날짜가 시작 날짜 보다 뒤에 있어야 합니다.");
      return;
    }
    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;

    startTime = (
      timeIputOneRef.current!.value || timeIputOneRef.current!.placeholder
    ).trim();
    endTime = (
      timeInputTwoRef.current!.value || timeInputTwoRef.current!.placeholder
    ).trim();

    if (!pattern.test(startTime) || !pattern.test(endTime)) {
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
    }

    if (clone.startDate === clone.endDate) {
      if (startTime > endTime) {
        return alert("종료 시간이 시작시간 보다 뒤에 있어야 합니다.");
      }
    }

    deleteAndCreate("create", startTime, endTime);
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
            className="mobile-input-title"
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
          <div className="faclock">
            <FontAwesomeIcon icon={faClock} className="Make-clock-icon" />
          </div>
          <PickerBox
            platform="mobile"
            startDate={startDate}
            endDate={endDate}
            openDate={openDate}
            setOpenDate={setOpenDate}
            time={[startTime, endTime]}
            openTime={openTime}
            setOpenTime={setOpenTime}
            timeInputOneRef={timeIputOneRef}
            timeInputTwoRef={timeInputTwoRef}
          />
          <div className="button-container">
            {param["*"] === "event/edit" && (
              <button
                className="mobile-button"
                type="button"
                onTouchEnd={() => deleteAndCreate("delete", startTime, endTime)}
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
