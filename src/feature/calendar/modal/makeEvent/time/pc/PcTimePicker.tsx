import { useEffect, useRef } from "react";
import { useModalStore } from "../../../../../../store/useModalStore";
import "./PcTimePicker.css";
import { useTimeDateStore } from "@/store/useTimeDateStore";

interface Props {
  order: string;
  startTime: string;
  endTime: string;
}

// "HH:mm" 포맷을 총 분(minutes)으로 변환하는 헬퍼 함수
const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// 기준 시간(baseStr)으로부터 대상 시간(timeStr)이 몇 분 뒤인지 계산 (24시간 회전 대응)
const getRelativeMinutes = (timeStr: string, baseStr: string): number => {
  const tMins = timeToMinutes(timeStr);
  const bMins = timeToMinutes(baseStr);
  return (tMins - bMins + 1440) % 1440;
};

// 15분 단위 시간 배열 생성 (컴포넌트 외부 선언으로 리렌더링 시 재생성 방지)
const generateDynamicTimeSlots = (
  startFrom: string,
): [string, string, string, string][] => {
  const slots: [string, string, string, string][] = [];

  const [startHour, startMin] = startFrom.split(":").map(Number);
  const startIndex = Math.floor((startHour * 60 + startMin) / 15);

  // 96번 반복 (15분 * 96 = 24시간)
  for (let i = 0; i < 96; i++) {
    const totalMinutes = (startIndex + i) * 15;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const ampm = +hour < 12 ? "오전" : "오후";
    const displayHour = String(hour).padStart(2, "0");
    const displayMinute = String(minute).padStart(2, "0");
    const rawValue = `${displayHour}:${displayMinute}`;

    slots.push([ampm, displayHour, displayMinute, rawValue]);
  }
  return slots;
};

const PcTimePicker = ({ order, startTime, endTime }: Props) => {
  const setTimeAction = useTimeDateStore((state) => state.setTime);
  const onClose = useTimeDateStore((state) => state.onClose);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentTime = order === "start" ? startTime : endTime;

  const timeSlots =
    order === "end" && startTime
      ? generateDynamicTimeSlots(startTime)
      : generateDynamicTimeSlots("00:00");

  const handleClick = (time: string) => {
    setTimeAction(order, time);
    onClose();
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    // 현재 타임피커 배열의 '기준 시작 시간' 파악
    const baseTime = order === "end" && startTime ? startTime : "00:00";

    // 기준 시간으로부터 타겟 시간 및 각 슬롯의 상대적 위치(분) 계산
    const targetRelMins = getRelativeMinutes(currentTime, baseTime);

    // 조건 충족하는 가장 가까운 인덱스 탐색: targetTime <= slot
    let targetIndex = timeSlots.findIndex((slot) => {
      const slotRelMins = getRelativeMinutes(slot[3], baseTime);
      return slotRelMins >= targetRelMins;
    });

    // 만약 범위를 벗어나 찾지 못했다면 가장 마지막 슬롯으로 지정
    if (targetIndex === -1) {
      targetIndex = timeSlots.length - 1;
    }

    // 중앙 정렬(-2) 및 00:30 미만(인덱스 2 미만) 예외 처리
    const ITEM_HEIGHT = 35;
    const scrollIndex = Math.max(0, targetIndex - 2);

    scrollRef.current.scrollTop = scrollIndex * ITEM_HEIGHT;
  }, [startTime, timeSlots]);

  return (
    <div className="pc-time-picker">
      <div className="pc-time-picker__box" ref={scrollRef}>
        <ul className="time-picker__list" role="listbox" aria-label="시간 선택">
          {timeSlots.map(
            ([ampm, displayHour, displayMinute, rawValue], index) => (
              <li
                key={`${rawValue}-${index}`}
                role="none"
                className="time-picker__item"
                style={{
                  background:
                    rawValue === currentTime
                      ? "rgba(219, 219, 219, 0.857)"
                      : "",
                }}
              >
                <button
                  type="button"
                  role="option"
                  onClick={() => handleClick(rawValue)}
                >
                  {`${ampm} ${+displayHour % 12 === 0 ? "12" : +displayHour % 12}:${displayMinute}`}
                </button>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};

export default PcTimePicker;
