import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { timeActions } from "../../store/time-slice";

const TimeBoxTwo = ({ timeTwoRef, TwoRef, timeVisible, timeRef }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(TwoRef);
    TwoRef.current.map(
      (item, index) =>
        item.innerText === timeTwoRef.current.placeholder &&
        TwoRef.current[index].scrollIntoView()
    );
  });

  const clickHandler = (e) => {
    dispatch(timeActions.lastTimetoggle());
    timeTwoRef.current.value = e.target.innerText;
    dispatch(timeActions.selectLastTime(e.target.innerText));
  };

  return (
    <div
      className={`time-select-two ${!timeVisible && "none"}`}
      ref={(el) => (timeRef.current[1] = el)}
    >
      <div id="time-one">
        <div ref={(el) => (TwoRef.current[0] = el)} onClick={clickHandler}>
          오전 00:30
        </div>
        <div ref={(el) => (TwoRef.current[1] = el)} onClick={clickHandler}>
          오전 01:00
        </div>
        <div ref={(el) => (TwoRef.current[2] = el)} onClick={clickHandler}>
          오전 01:30
        </div>
        <div ref={(el) => (TwoRef.current[3] = el)} onClick={clickHandler}>
          오전 02:00
        </div>
        <div ref={(el) => (TwoRef.current[4] = el)} onClick={clickHandler}>
          오전 02:30
        </div>
        <div ref={(el) => (TwoRef.current[5] = el)} onClick={clickHandler}>
          오전 03:00
        </div>
        <div ref={(el) => (TwoRef.current[6] = el)} onClick={clickHandler}>
          오전 03:30
        </div>
        <div ref={(el) => (TwoRef.current[7] = el)} onClick={clickHandler}>
          오전 04:00
        </div>
        <div ref={(el) => (TwoRef.current[8] = el)} onClick={clickHandler}>
          오전 04:30
        </div>
        <div ref={(el) => (TwoRef.current[9] = el)} onClick={clickHandler}>
          오전 05:00
        </div>
        <div ref={(el) => (TwoRef.current[10] = el)} onClick={clickHandler}>
          오전 05:30
        </div>
        <div ref={(el) => (TwoRef.current[11] = el)} onClick={clickHandler}>
          오전 06:00
        </div>
        <div ref={(el) => (TwoRef.current[12] = el)} onClick={clickHandler}>
          오전 06:30
        </div>
        <div ref={(el) => (TwoRef.current[13] = el)} onClick={clickHandler}>
          오전 07:00
        </div>
        <div ref={(el) => (TwoRef.current[14] = el)} onClick={clickHandler}>
          오전 07:30
        </div>
        <div ref={(el) => (TwoRef.current[15] = el)} onClick={clickHandler}>
          오전 08:00
        </div>
        <div ref={(el) => (TwoRef.current[16] = el)} onClick={clickHandler}>
          오전 08:30
        </div>
        <div ref={(el) => (TwoRef.current[17] = el)} onClick={clickHandler}>
          오전 09:00
        </div>
        <div ref={(el) => (TwoRef.current[18] = el)} onClick={clickHandler}>
          오전 09:30
        </div>
        <div ref={(el) => (TwoRef.current[19] = el)} onClick={clickHandler}>
          오전 10:00
        </div>
        <div ref={(el) => (TwoRef.current[20] = el)} onClick={clickHandler}>
          오전 10:30
        </div>
        <div ref={(el) => (TwoRef.current[21] = el)} onClick={clickHandler}>
          오전 11:00
        </div>
        <div ref={(el) => (TwoRef.current[22] = el)} onClick={clickHandler}>
          오전 11:30
        </div>
        <div ref={(el) => (TwoRef.current[23] = el)} onClick={clickHandler}>
          오후 00:00
        </div>
        <div ref={(el) => (TwoRef.current[24] = el)} onClick={clickHandler}>
          오후 00:30
        </div>
        <div ref={(el) => (TwoRef.current[25] = el)} onClick={clickHandler}>
          오후 01:00
        </div>
        <div ref={(el) => (TwoRef.current[26] = el)} onClick={clickHandler}>
          오후 01:30
        </div>
        <div ref={(el) => (TwoRef.current[27] = el)} onClick={clickHandler}>
          오후 02:00
        </div>
        <div ref={(el) => (TwoRef.current[28] = el)} onClick={clickHandler}>
          오후 02:30
        </div>
        <div ref={(el) => (TwoRef.current[29] = el)} onClick={clickHandler}>
          오후 03:00
        </div>
        <div ref={(el) => (TwoRef.current[30] = el)} onClick={clickHandler}>
          오후 03:30
        </div>
        <div ref={(el) => (TwoRef.current[31] = el)} onClick={clickHandler}>
          오후 04:00
        </div>
        <div ref={(el) => (TwoRef.current[32] = el)} onClick={clickHandler}>
          오후 04:30
        </div>
        <div ref={(el) => (TwoRef.current[33] = el)} onClick={clickHandler}>
          오후 05:00
        </div>
        <div ref={(el) => (TwoRef.current[34] = el)} onClick={clickHandler}>
          오후 05:30
        </div>
        <div ref={(el) => (TwoRef.current[35] = el)} onClick={clickHandler}>
          오후 06:00
        </div>
        <div ref={(el) => (TwoRef.current[36] = el)} onClick={clickHandler}>
          오후 06:30
        </div>
        <div ref={(el) => (TwoRef.current[37] = el)} onClick={clickHandler}>
          오후 07:00
        </div>
        <div ref={(el) => (TwoRef.current[38] = el)} onClick={clickHandler}>
          오후 07:30
        </div>
        <div ref={(el) => (TwoRef.current[39] = el)} onClick={clickHandler}>
          오후 08:00
        </div>
        <div ref={(el) => (TwoRef.current[40] = el)} onClick={clickHandler}>
          오후 08:30
        </div>
        <div ref={(el) => (TwoRef.current[41] = el)} onClick={clickHandler}>
          오후 09:00
        </div>
        <div ref={(el) => (TwoRef.current[42] = el)} onClick={clickHandler}>
          오후 09:15
        </div>
        <div ref={(el) => (TwoRef.current[43] = el)} onClick={clickHandler}>
          오후 09:30
        </div>
        <div ref={(el) => (TwoRef.current[44] = el)} onClick={clickHandler}>
          오후 09:45
        </div>
        <div ref={(el) => (TwoRef.current[45] = el)} onClick={clickHandler}>
          오후 10:00
        </div>
        <div ref={(el) => (TwoRef.current[46] = el)} onClick={clickHandler}>
          오후 10:15
        </div>
        <div ref={(el) => (TwoRef.current[47] = el)} onClick={clickHandler}>
          오후 10:30
        </div>
        <div ref={(el) => (TwoRef.current[48] = el)} onClick={clickHandler}>
          오후 10:45
        </div>
        <div ref={(el) => (TwoRef.current[49] = el)} onClick={clickHandler}>
          오후 11:00
        </div>
        <div ref={(el) => (TwoRef.current[50] = el)} onClick={clickHandler}>
          오후 11:30
        </div>
        <div ref={(el) => (TwoRef.current[50] = el)} onClick={clickHandler}>
          오후 11:45
        </div>
      </div>
    </div>
  );
};

export default TimeBoxTwo;
