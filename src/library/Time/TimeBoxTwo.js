import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { timeActions } from "../../store/time-slice";

const TimeBoxTwo = ({ timeTwoRef, timeRef, timeVisible }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    timeRef.current.map((item, index) =>
      item.innerText === timeTwoRef.current.placeholder
        ? timeRef.current[index].scrollIntoView()
        : null
    );
  })

  const clickHandler = (e) => {
    dispatch(timeActions.lastTimetoggle());
    dispatch(timeActions.selectLastTime(e.target.innerText));
  };

  return (
    <div className={`time-select ${!timeVisible && 'none'}`}>
      <div id="time-one">
          <div ref={el=> timeRef.current[0] = el} onClick={clickHandler} >오전 00:30</div>
          <div ref={el=> timeRef.current[1] = el} onClick={clickHandler} >오전 01:00</div>
          <div ref={el=> timeRef.current[2] = el} onClick={clickHandler} >오전 01:30</div>
          <div ref={el=> timeRef.current[3] = el} onClick={clickHandler} >오전 02:00</div>
          <div ref={el=> timeRef.current[4] = el} onClick={clickHandler} >오전 02:30</div>
          <div ref={el=> timeRef.current[5] = el} onClick={clickHandler} >오전 03:00</div>
          <div ref={el=> timeRef.current[6] = el} onClick={clickHandler} >오전 03:30</div>
          <div ref={el=> timeRef.current[7] = el} onClick={clickHandler} >오전 04:00</div>
          <div ref={el=> timeRef.current[8] = el} onClick={clickHandler} >오전 04:30</div>
          <div ref={el=> timeRef.current[9] = el} onClick={clickHandler} >오전 05:00</div>
          <div ref={el=> timeRef.current[10] = el} onClick={clickHandler} >오전 05:30</div>
          <div ref={el=> timeRef.current[11] = el} onClick={clickHandler} >오전 06:00</div>
          <div ref={el=> timeRef.current[12] = el} onClick={clickHandler} >오전 06:30</div>
          <div ref={el=> timeRef.current[13] = el} onClick={clickHandler} >오전 07:00</div>
          <div ref={el=> timeRef.current[14] = el} onClick={clickHandler} >오전 07:30</div>
          <div ref={el=> timeRef.current[15] = el} onClick={clickHandler} >오전 08:00</div>
          <div ref={el=> timeRef.current[16] = el} onClick={clickHandler} >오전 08:30</div>
          <div ref={el=> timeRef.current[17] = el} onClick={clickHandler} >오전 09:00</div>
          <div ref={el=> timeRef.current[18] = el} onClick={clickHandler} >오전 09:30</div>
          <div ref={el=> timeRef.current[19] = el} onClick={clickHandler} >오전 10:00</div>
          <div ref={el=> timeRef.current[20] = el} onClick={clickHandler} >오전 10:30</div>
          <div ref={el=> timeRef.current[21] = el} onClick={clickHandler} >오전 11:00</div>
          <div ref={el=> timeRef.current[22] = el} onClick={clickHandler} >오전 11:30</div>
          <div ref={el=> timeRef.current[23] = el} onClick={clickHandler} >오후 00:00</div>
          <div ref={el=> timeRef.current[24] = el} onClick={clickHandler} >오후 00:30</div>
          <div ref={el=> timeRef.current[25] = el} onClick={clickHandler} >오후 01:00</div>
          <div ref={el=> timeRef.current[26] = el} onClick={clickHandler} >오후 01:30</div>
          <div ref={el=> timeRef.current[27] = el} onClick={clickHandler} >오후 02:00</div>
          <div ref={el=> timeRef.current[28] = el} onClick={clickHandler} >오후 02:30</div>
          <div ref={el=> timeRef.current[29] = el} onClick={clickHandler} >오후 03:00</div>
          <div ref={el=> timeRef.current[30] = el} onClick={clickHandler} >오후 03:30</div>
          <div ref={el=> timeRef.current[31] = el} onClick={clickHandler} >오후 04:00</div>
          <div ref={el=> timeRef.current[32] = el} onClick={clickHandler} >오후 04:30</div>
          <div ref={el=> timeRef.current[33] = el} onClick={clickHandler} >오후 05:00</div>
          <div ref={el=> timeRef.current[34] = el} onClick={clickHandler} >오후 05:30</div>
          <div ref={el=> timeRef.current[35] = el} onClick={clickHandler} >오후 06:00</div>
          <div ref={el=> timeRef.current[36] = el} onClick={clickHandler} >오후 06:30</div>
          <div ref={el=> timeRef.current[37] = el} onClick={clickHandler} >오후 07:00</div>
          <div ref={el=> timeRef.current[38] = el} onClick={clickHandler} >오후 07:30</div>
          <div ref={el=> timeRef.current[39] = el} onClick={clickHandler} >오후 08:00</div>
          <div ref={el=> timeRef.current[40] = el} onClick={clickHandler} >오후 08:30</div>
          <div ref={el=> timeRef.current[41] = el} onClick={clickHandler} >오후 09:00</div>
          <div ref={el=> timeRef.current[42] = el} onClick={clickHandler} >오후 09:15</div>
          <div ref={el=> timeRef.current[43] = el} onClick={clickHandler} >오후 09:30</div>
          <div ref={el=> timeRef.current[44] = el} onClick={clickHandler} >오후 09:45</div>
          <div ref={el=> timeRef.current[45] = el} onClick={clickHandler} >오후 10:00</div>
          <div ref={el=> timeRef.current[46] = el} onClick={clickHandler} >오후 10:15</div>
          <div ref={el=> timeRef.current[47] = el} onClick={clickHandler} >오후 10:30</div>
          <div ref={el=> timeRef.current[48] = el} onClick={clickHandler} >오후 10:45</div>
          <div ref={el=> timeRef.current[49] = el} onClick={clickHandler} >오후 11:00</div>
          <div ref={el=> timeRef.current[50] = el} onClick={clickHandler} >오후 11:30</div>
          <div ref={el=> timeRef.current[51] = el} onClick={clickHandler} >오전 00:00</div>
          <div ref={el=> timeRef.current[52] = el} onClick={clickHandler} >오전 00:30</div>
          <div ref={el=> timeRef.current[53] = el} onClick={clickHandler} >오전 01:00</div>
          <div ref={el=> timeRef.current[54] = el} onClick={clickHandler} >오전 01:30</div>
          <div ref={el=> timeRef.current[55] = el} onClick={clickHandler} >오전 02:00</div>
          <div ref={el=> timeRef.current[56] = el} onClick={clickHandler} >오전 02:30</div>
      </div>
    </div>
  );
};

export default TimeBoxTwo;
