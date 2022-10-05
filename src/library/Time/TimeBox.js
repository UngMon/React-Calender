import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { timeActions } from "../../store/time-slice";

const TimeBox = ({ timeOneRef, OneRef, timeVisible }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    OneRef.current.map((item, index) =>
      item.innerText === timeOneRef.current.placeholder
        ? OneRef.current[index].scrollIntoView()
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
        <div ref={el => OneRef.current[0] = el} onClick={clickHandler}>오전 00:15</div>
        <div ref={el => OneRef.current[1] = el} onClick={clickHandler}>오전 00:30</div>
        <div ref={el => OneRef.current[2] = el} onClick={clickHandler}>오전 00:45</div>
        <div ref={el => OneRef.current[3] = el} onClick={clickHandler}>오전 01:00</div>
        <div ref={el => OneRef.current[4] = el} onClick={clickHandler}>오전 01:15</div>
        <div ref={el => OneRef.current[5] = el} onClick={clickHandler}>오전 01:30</div>
        <div ref={el => OneRef.current[6] = el} onClick={clickHandler}>오전 01:45</div>
        <div ref={el => OneRef.current[7] = el} onClick={clickHandler}>오전 02:00</div>
        <div ref={el => OneRef.current[8] = el} onClick={clickHandler}>오전 02:15</div>
        <div ref={el => OneRef.current[9] = el} onClick={clickHandler}>오전 02:30</div>
        <div ref={el => OneRef.current[10] = el} onClick={clickHandler}>오전 02:45</div>
        <div ref={el => OneRef.current[11] = el} onClick={clickHandler}>오전 03:00</div>
        <div ref={el => OneRef.current[12] = el} onClick={clickHandler}>오전 03:15</div>
        <div ref={el => OneRef.current[13] = el} onClick={clickHandler}>오전 03:30</div>
        <div ref={el => OneRef.current[14] = el} onClick={clickHandler}>오전 03:45</div>
        <div ref={el => OneRef.current[15] = el} onClick={clickHandler}>오전 04:00</div>
        <div ref={el => OneRef.current[16] = el} onClick={clickHandler}>오전 04:15</div>
        <div ref={el => OneRef.current[17] = el} onClick={clickHandler}>오전 04:30</div>
        <div ref={el => OneRef.current[18] = el} onClick={clickHandler}>오전 04:45</div>
        <div ref={el => OneRef.current[19] = el} onClick={clickHandler}>오전 05:00</div>
        <div ref={el => OneRef.current[20] = el} onClick={clickHandler}>오전 05:15</div>
        <div ref={el => OneRef.current[21] = el} onClick={clickHandler}>오전 05:30</div>
        <div ref={el => OneRef.current[22] = el} onClick={clickHandler}>오전 05:45</div>
        <div ref={el => OneRef.current[23] = el} onClick={clickHandler}>오전 06:00</div>
        <div ref={el => OneRef.current[24] = el} onClick={clickHandler}>오전 06:15</div>
        <div ref={el => OneRef.current[25] = el} onClick={clickHandler}>오전 06:30</div>
        <div ref={el => OneRef.current[26] = el} onClick={clickHandler}>오전 06:45</div>
        <div ref={el => OneRef.current[27] = el} onClick={clickHandler}>오전 07:00</div>
        <div ref={el => OneRef.current[28] = el} onClick={clickHandler}>오전 07:15</div>
        <div ref={el => OneRef.current[29] = el} onClick={clickHandler}>오전 07:30</div>
        <div ref={el => OneRef.current[30] = el} onClick={clickHandler}>오전 07:45</div>
        <div ref={el => OneRef.current[31] = el} onClick={clickHandler}>오전 08:00</div>
        <div ref={el => OneRef.current[32] = el} onClick={clickHandler}>오전 08:15</div>
        <div ref={el => OneRef.current[33] = el} onClick={clickHandler}>오전 08:30</div>
        <div ref={el => OneRef.current[34] = el} onClick={clickHandler}>오전 08:45</div>
        <div ref={el => OneRef.current[35] = el} onClick={clickHandler}>오전 09:00</div>
        <div ref={el => OneRef.current[36] = el} onClick={clickHandler}>오전 09:15</div>
        <div ref={el => OneRef.current[37] = el} onClick={clickHandler}>오전 09:30</div>
        <div ref={el => OneRef.current[38] = el} onClick={clickHandler}>오전 09:45</div>
        <div ref={el => OneRef.current[39] = el} onClick={clickHandler}>오전 10:00</div>
        <div ref={el => OneRef.current[40] = el} onClick={clickHandler}>오전 10:15</div>
        <div ref={el => OneRef.current[41] = el} onClick={clickHandler}>오전 10:30</div>
        <div ref={el => OneRef.current[42] = el} onClick={clickHandler}>오전 10:45</div>
        <div ref={el => OneRef.current[43] = el} onClick={clickHandler}>오전 11:00</div>
        <div ref={el => OneRef.current[44] = el} onClick={clickHandler}>오전 11:15</div>
        <div ref={el => OneRef.current[45] = el} onClick={clickHandler}>오전 11:30</div>
        <div ref={el => OneRef.current[46] = el} onClick={clickHandler}>오전 11:45</div>
        <div ref={el => OneRef.current[47] = el} onClick={clickHandler}>오후 00:00</div>
        <div ref={el => OneRef.current[48] = el} onClick={clickHandler}>오후 00:15</div>
        <div ref={el => OneRef.current[49] = el} onClick={clickHandler}>오후 00:30</div>
        <div ref={el => OneRef.current[50] = el} onClick={clickHandler}>오후 00:45</div>
        <div ref={el => OneRef.current[51] = el} onClick={clickHandler}>오후 01:00</div>
        <div ref={el => OneRef.current[52] = el} onClick={clickHandler}>오후 01:15</div>
        <div ref={el => OneRef.current[53] = el} onClick={clickHandler}>오후 01:30</div>
        <div ref={el => OneRef.current[54] = el} onClick={clickHandler}>오후 01:45</div>
        <div ref={el => OneRef.current[55] = el} onClick={clickHandler}>오후 02:00</div>
        <div ref={el => OneRef.current[56] = el} onClick={clickHandler}>오후 02:15</div>
        <div ref={el => OneRef.current[57] = el} onClick={clickHandler}>오후 02:30</div>
        <div ref={el => OneRef.current[58] = el} onClick={clickHandler}>오후 02:45</div>
        <div ref={el => OneRef.current[59] = el} onClick={clickHandler}>오후 03:00</div>
        <div ref={el => OneRef.current[60] = el} onClick={clickHandler}>오후 03:15</div>
        <div ref={el => OneRef.current[61] = el} onClick={clickHandler}>오후 03:30</div>
        <div ref={el => OneRef.current[62] = el} onClick={clickHandler}>오후 03:45</div>
        <div ref={el => OneRef.current[63] = el} onClick={clickHandler}>오후 04:00</div>
        <div ref={el => OneRef.current[64] = el} onClick={clickHandler}>오후 04:15</div>
        <div ref={el => OneRef.current[65] = el} onClick={clickHandler}>오후 04:30</div>
        <div ref={el => OneRef.current[66] = el} onClick={clickHandler}>오후 04:45</div>
        <div ref={el => OneRef.current[67] = el} onClick={clickHandler}>오후 05:00</div>
        <div ref={el => OneRef.current[68] = el} onClick={clickHandler}>오후 05:15</div>
        <div ref={el => OneRef.current[69] = el} onClick={clickHandler}>오후 05:30</div>
        <div ref={el => OneRef.current[70] = el} onClick={clickHandler}>오후 05:45</div>
        <div ref={el => OneRef.current[71] = el} onClick={clickHandler}>오후 06:00</div>
        <div ref={el => OneRef.current[72] = el} onClick={clickHandler}>오후 06:15</div>
        <div ref={el => OneRef.current[73] = el} onClick={clickHandler}>오후 06:30</div>
        <div ref={el => OneRef.current[74] = el} onClick={clickHandler}>오후 06:45</div>
        <div ref={el => OneRef.current[75] = el} onClick={clickHandler}>오후 07:00</div>
        <div ref={el => OneRef.current[76] = el} onClick={clickHandler}>오후 07:15</div>
        <div ref={el => OneRef.current[77] = el} onClick={clickHandler}>오후 07:30</div>
        <div ref={el => OneRef.current[78] = el} onClick={clickHandler}>오후 07:45</div>
        <div ref={el => OneRef.current[79] = el} onClick={clickHandler}>오후 08:00</div>
        <div ref={el => OneRef.current[80] = el} onClick={clickHandler}>오후 08:15</div>
        <div ref={el => OneRef.current[81] = el} onClick={clickHandler}>오후 08:30</div>
        <div ref={el => OneRef.current[82] = el} onClick={clickHandler}>오후 08:45</div>
        <div ref={el => OneRef.current[83] = el} onClick={clickHandler}>오후 09:00</div>
        <div ref={el => OneRef.current[84] = el} onClick={clickHandler}>오후 09:15</div>
        <div ref={el => OneRef.current[85] = el} onClick={clickHandler}>오후 09:30</div>
        <div ref={el => OneRef.current[86] = el} onClick={clickHandler}>오후 09:45</div>
        <div ref={el => OneRef.current[87] = el} onClick={clickHandler}>오후 10:00</div>
        <div ref={el => OneRef.current[88] = el} onClick={clickHandler}>오후 10:15</div>
        <div ref={el => OneRef.current[89] = el} onClick={clickHandler}>오후 10:30</div>
        <div ref={el => OneRef.current[90] = el} onClick={clickHandler}>오후 10:45</div>
        <div ref={el => OneRef.current[91] = el} onClick={clickHandler}>오후 11:00</div>
        <div ref={el => OneRef.current[92] = el} onClick={clickHandler}>오후 11:15</div>
        <div ref={el => OneRef.current[93] = el} onClick={clickHandler}>오후 11:30</div>
        <div ref={el => OneRef.current[94] = el} onClick={clickHandler}>오후 11:45</div>
      </div>
    </div>
  );
};

export default TimeBox;
