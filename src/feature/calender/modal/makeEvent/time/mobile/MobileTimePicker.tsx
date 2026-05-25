import React, { useEffect, useState } from "react";
import { useModalStore } from "../../../../../../store/useModalStore";
import DialColumn from "./DialColumn";
import "./MobileTimePicker.css";
import { useTimeDateStore } from "@/store/useTimeDateStore";

// 데이터 생성 규칙 변경
const ampmList = ["오전", "오후"];
// 시: 1부터 12까지
const hourList = Array.from({ length: 12 }, (_, i) => i + 1);
// 분: 0부터 55까지 5씩 증가 (0, 5, 10 ... 55)
const minuteList = Array.from({ length: 12 }, (_, i) => i * 5);

interface Props {
  order: string;
}

const MobileTimePicker = ({ order }: Props) => {
  const initialTime =
    useTimeDateStore.getState()[order === "start" ? "startTime" : "endTime"];

  const [h, m] = initialTime.split(":").map(Number);
  const initialAmpm = h >= 12 ? "오후" : "오전";
  const initialHour = h % 12 === 0 ? 12 : h % 12;

  const [prevOrder, setPrevOrder] = useState<string>(order);
  const [ampm, setAmpm] = useState<string | number>(initialAmpm);
  const [hour, setHour] = useState<string | number>(initialHour);
  const [minute, setMinute] = useState<string | number>(m);
  const setTimeAction = useTimeDateStore((state) => state.setTime);

  // 시(Hour)가 바뀔 때 호출되는 커스텀 핸들러
  const handleHourChange = (newHour: string | number) => {
    setHour((prevHour) => {
      // 오후 12시 -> 11시 오전 11시로 변경
      if (
        (prevHour === 12 && newHour === 11) ||
        (prevHour === 11 && newHour === 12)
      ) {
        setAmpm((prev) => (prev === "오전" ? "오후" : "오전"));
      }
      return newHour;
    });
  };

  // 3. 값이 바뀔 때마다 Store 업데이트 (HH:mm 형식으로 변환하여 저장)
  useEffect(() => {
    if (prevOrder !== order) {
      setPrevOrder(order);
      setAmpm(initialAmpm);
      setHour(initialHour);
      setMinute(m);
      return;
    }

    let finalHour = Number(hour);
    if (ampm === "오후" && finalHour !== 12) finalHour += 12;
    if (ampm === "오전" && finalHour === 12) finalHour = 0;

    const timeStr = `${String(finalHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    // Store 액션 호출 (여기서 부모 리렌더링 없이 값만 변경)

    setTimeAction(order, timeStr);
  }, [ampm, hour, minute, order]);

  return (
    <div className="time-dial-wrapper">
      {/* 오전/오후는 무한 스크롤 X */}
      <DialColumn
        width={42}
        items={ampmList}
        value={ampm}
        onChange={setAmpm}
        isInfinite={false}
      />

      {/* 시/분은 무한 스크롤 O */}
      <DialColumn
        width={32}
        items={hourList}
        value={hour}
        onChange={handleHourChange}
        isInfinite={true}
      />

      <div className="dial-separator">:</div>

      <DialColumn
        width={32}
        items={minuteList}
        value={minute}
        onChange={setMinute}
        isInfinite={true}
      />
    </div>
  );
};

export default React.memo(MobileTimePicker);
