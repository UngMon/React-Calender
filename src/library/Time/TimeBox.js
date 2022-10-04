import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { timeActions } from "../../store/time-slice";

const TimeBox = ({ timeOneRef, timeRef, timeVisible }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    timeRef.current.map((item, index) =>
      item.innerText === timeOneRef.current.placeholder
        ? timeRef.current[index].scrollIntoView()
        : null
    );
  })

  const clickHandler = (e) => {
    dispatch(timeActions.firstTimetoggle());
    timeOneRef.current.value = e.target.innerText;
    dispatch(timeActions.selectFristTime(e.target.innerText));
  };

  return (
    <div className={`time-select ${!timeVisible && 'none'}`}>
      <div id="time-one" >
        <div ref={el => timeRef.current[0] = el} onClick={clickHandler}>오전 00:15</div>
        <div ref={el => timeRef.current[1] = el} onClick={clickHandler}>오전 00:30</div>
        <div ref={el => timeRef.current[2] = el} onClick={clickHandler}>오전 00:45</div>
        <div ref={el => timeRef.current[3] = el} onClick={clickHandler}>오전 01:00</div>
        <div ref={el => timeRef.current[4] = el} onClick={clickHandler}>오전 01:15</div>
        <div ref={el => timeRef.current[5] = el} onClick={clickHandler}>오전 01:30</div>
        <div ref={el => timeRef.current[6] = el} onClick={clickHandler}>오전 01:45</div>
        <div ref={el => timeRef.current[7] = el} onClick={clickHandler}>오전 02:00</div>
        <div ref={el => timeRef.current[8] = el} onClick={clickHandler}>오전 02:15</div>
        <div ref={el => timeRef.current[9] = el} onClick={clickHandler}>오전 02:30</div>
        <div ref={el => timeRef.current[10] = el} onClick={clickHandler}>오전 02:45</div>
        <div ref={el => timeRef.current[11] = el} onClick={clickHandler}>오전 03:00</div>
        <div ref={el => timeRef.current[12] = el} onClick={clickHandler}>오전 03:15</div>
        <div ref={el => timeRef.current[13] = el} onClick={clickHandler}>오전 03:30</div>
        <div ref={el => timeRef.current[14] = el} onClick={clickHandler}>오전 03:45</div>
        <div ref={el => timeRef.current[15] = el} onClick={clickHandler}>오전 04:00</div>
        <div ref={el => timeRef.current[16] = el} onClick={clickHandler}>오전 04:15</div>
        <div ref={el => timeRef.current[17] = el} onClick={clickHandler}>오전 04:30</div>
        <div ref={el => timeRef.current[18] = el} onClick={clickHandler}>오전 04:45</div>
        <div ref={el => timeRef.current[19] = el} onClick={clickHandler}>오전 05:00</div>
        <div ref={el => timeRef.current[20] = el} onClick={clickHandler}>오전 05:15</div>
        <div ref={el => timeRef.current[21] = el} onClick={clickHandler}>오전 05:30</div>
        <div ref={el => timeRef.current[22] = el} onClick={clickHandler}>오전 05:45</div>
        <div ref={el => timeRef.current[23] = el} onClick={clickHandler}>오전 06:00</div>
        <div ref={el => timeRef.current[24] = el} onClick={clickHandler}>오전 06:15</div>
        <div ref={el => timeRef.current[25] = el} onClick={clickHandler}>오전 06:30</div>
        <div ref={el => timeRef.current[26] = el} onClick={clickHandler}>오전 06:45</div>
        <div ref={el => timeRef.current[27] = el} onClick={clickHandler}>오전 07:00</div>
        <div ref={el => timeRef.current[28] = el} onClick={clickHandler}>오전 07:15</div>
        <div ref={el => timeRef.current[29] = el} onClick={clickHandler}>오전 07:30</div>
        <div ref={el => timeRef.current[30] = el} onClick={clickHandler}>오전 07:45</div>
        <div ref={el => timeRef.current[31] = el} onClick={clickHandler}>오전 08:00</div>
        <div ref={el => timeRef.current[32] = el} onClick={clickHandler}>오전 08:15</div>
        <div ref={el => timeRef.current[33] = el} onClick={clickHandler}>오전 08:30</div>
        <div ref={el => timeRef.current[34] = el} onClick={clickHandler}>오전 08:45</div>
        <div ref={el => timeRef.current[35] = el} onClick={clickHandler}>오전 09:00</div>
        <div ref={el => timeRef.current[36] = el} onClick={clickHandler}>오전 09:15</div>
        <div ref={el => timeRef.current[37] = el} onClick={clickHandler}>오전 09:30</div>
        <div ref={el => timeRef.current[38] = el} onClick={clickHandler}>오전 09:45</div>
        <div ref={el => timeRef.current[39] = el} onClick={clickHandler}>오전 10:00</div>
        <div ref={el => timeRef.current[40] = el} onClick={clickHandler}>오전 10:15</div>
        <div ref={el => timeRef.current[41] = el} onClick={clickHandler}>오전 10:30</div>
        <div ref={el => timeRef.current[42] = el} onClick={clickHandler}>오전 10:45</div>
        <div ref={el => timeRef.current[43] = el} onClick={clickHandler}>오전 11:00</div>
        <div ref={el => timeRef.current[44] = el} onClick={clickHandler}>오전 11:15</div>
        <div ref={el => timeRef.current[45] = el} onClick={clickHandler}>오전 11:30</div>
        <div ref={el => timeRef.current[46] = el} onClick={clickHandler}>오전 11:45</div>
        <div ref={el => timeRef.current[47] = el} onClick={clickHandler}>오후 00:00</div>
        <div ref={el => timeRef.current[48] = el} onClick={clickHandler}>오후 00:15</div>
        <div ref={el => timeRef.current[49] = el} onClick={clickHandler}>오후 00:30</div>
        <div ref={el => timeRef.current[50] = el} onClick={clickHandler}>오후 00:45</div>
        <div ref={el => timeRef.current[51] = el} onClick={clickHandler}>오후 01:00</div>
        <div ref={el => timeRef.current[52] = el} onClick={clickHandler}>오후 01:15</div>
        <div ref={el => timeRef.current[53] = el} onClick={clickHandler}>오후 01:30</div>
        <div ref={el => timeRef.current[54] = el} onClick={clickHandler}>오후 01:45</div>
        <div ref={el => timeRef.current[55] = el} onClick={clickHandler}>오후 02:00</div>
        <div ref={el => timeRef.current[56] = el} onClick={clickHandler}>오후 02:15</div>
        <div ref={el => timeRef.current[57] = el} onClick={clickHandler}>오후 02:30</div>
        <div ref={el => timeRef.current[58] = el} onClick={clickHandler}>오후 02:45</div>
        <div ref={el => timeRef.current[59] = el} onClick={clickHandler}>오후 03:00</div>
        <div ref={el => timeRef.current[60] = el} onClick={clickHandler}>오후 03:15</div>
        <div ref={el => timeRef.current[61] = el} onClick={clickHandler}>오후 03:30</div>
        <div ref={el => timeRef.current[62] = el} onClick={clickHandler}>오후 03:45</div>
        <div ref={el => timeRef.current[63] = el} onClick={clickHandler}>오후 04:00</div>
        <div ref={el => timeRef.current[64] = el} onClick={clickHandler}>오후 04:15</div>
        <div ref={el => timeRef.current[65] = el} onClick={clickHandler}>오후 04:30</div>
        <div ref={el => timeRef.current[66] = el} onClick={clickHandler}>오후 04:45</div>
        <div ref={el => timeRef.current[67] = el} onClick={clickHandler}>오후 05:00</div>
        <div ref={el => timeRef.current[68] = el} onClick={clickHandler}>오후 05:15</div>
        <div ref={el => timeRef.current[69] = el} onClick={clickHandler}>오후 05:30</div>
        <div ref={el => timeRef.current[70] = el} onClick={clickHandler}>오후 05:45</div>
        <div ref={el => timeRef.current[71] = el} onClick={clickHandler}>오후 06:00</div>
        <div ref={el => timeRef.current[72] = el} onClick={clickHandler}>오후 06:15</div>
        <div ref={el => timeRef.current[73] = el} onClick={clickHandler}>오후 06:30</div>
        <div ref={el => timeRef.current[74] = el} onClick={clickHandler}>오후 06:45</div>
        <div ref={el => timeRef.current[75] = el} onClick={clickHandler}>오후 07:00</div>
        <div ref={el => timeRef.current[76] = el} onClick={clickHandler}>오후 07:15</div>
        <div ref={el => timeRef.current[77] = el} onClick={clickHandler}>오후 07:30</div>
        <div ref={el => timeRef.current[78] = el} onClick={clickHandler}>오후 07:45</div>
        <div ref={el => timeRef.current[79] = el} onClick={clickHandler}>오후 08:00</div>
        <div ref={el => timeRef.current[80] = el} onClick={clickHandler}>오후 08:15</div>
        <div ref={el => timeRef.current[81] = el} onClick={clickHandler}>오후 08:30</div>
        <div ref={el => timeRef.current[82] = el} onClick={clickHandler}>오후 08:45</div>
        <div ref={el => timeRef.current[83] = el} onClick={clickHandler}>오후 09:00</div>
        <div ref={el => timeRef.current[84] = el} onClick={clickHandler}>오후 09:15</div>
        <div ref={el => timeRef.current[85] = el} onClick={clickHandler}>오후 09:30</div>
        <div ref={el => timeRef.current[86] = el} onClick={clickHandler}>오후 09:45</div>
        <div ref={el => timeRef.current[87] = el} onClick={clickHandler}>오후 10:00</div>
        <div ref={el => timeRef.current[88] = el} onClick={clickHandler}>오후 10:15</div>
        <div ref={el => timeRef.current[89] = el} onClick={clickHandler}>오후 10:30</div>
        <div ref={el => timeRef.current[90] = el} onClick={clickHandler}>오후 10:45</div>
        <div ref={el => timeRef.current[91] = el} onClick={clickHandler}>오후 11:00</div>
        <div ref={el => timeRef.current[92] = el} onClick={clickHandler}>오후 11:15</div>
        <div ref={el => timeRef.current[93] = el} onClick={clickHandler}>오후 11:30</div>
        <div ref={el => timeRef.current[94] = el} onClick={clickHandler}>오후 11:45</div>
      </div>
    </div>
  );
};

export default TimeBox;
