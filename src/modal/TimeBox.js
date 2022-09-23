import { useDispatch } from "react-redux";
import { timeActions } from "../store/time-slice";

const value = [
  "오전 00:00",
  "오전 00:15",
  "오전 00:30",
  "오전 00:45",
  "오전 01:00",
  "오전 01:15",
  "오전 01:30",
  "오전 01:45",
  "오전 02:00",
  "오전 02:15",
  "오전 02:30",
  "오전 02:45",
  "오전 03:00",
  "오전 03:15",
  "오전 03:30",
  "오전 03:45",
  "오전 04:00",
  "오전 04:15",
  "오전 04:30",
  "오전 04:45",
  "오전 05:00",
  "오전 05:15",
  "오전 05:30",
  "오전 05:45",
  "오전 06:00",
  "오전 06:15",
  "오전 06:30",
  "오전 06:45",
  "오전 07:00",
  "오전 07:15",
  "오전 07:30",
  "오전 07:45",
  "오전 08:00",
  "오전 08:15",
  "오전 08:30",
  "오전 08:45",
  "오전 09:00",
  "오전 09:15",
  "오전 09:30",
  "오전 09:45",
  "오전 10:00",
  "오전 10:15",
  "오전 10:30",
  "오전 10:45",
  "오전 11:00",
  "오전 11:15",
  "오전 11:30",
  "오전 11:45",
  "오후 00:00",
  "오후 00:15",
  "오후 00:30",
  "오후 00:45",
  "오후 01:00",
  "오후 01:15",
  "오후 01:30",
  "오후 02:45",
  "오후 02:00",
  "오후 02:15",
  "오후 02:30",
  "오후 02:45",
  "오후 03:00",
  "오후 03:15",
  "오후 03:30",
  "오후 03:45",
  "오후 04:00",
  "오후 04:15",
  "오후 04:30",
  "오후 04:45",
  "오후 05:00",
  "오후 05:15",
  "오후 05:30",
  "오후 05:45",
  "오후 06:00",
  "오후 06:15",
  "오후 06:30",
  "오후 06:45",
  "오후 07:00",
  "오후 07:15",
  "오후 07:30",
  "오후 07:45",
  "오후 08:00",
  "오후 08:15",
  "오후 08:30",
  "오후 08:45",
  "오후 09:00",
  "오후 09:15",
  "오후 09:30",
  "오후 09:45",
  "오후 10:00",
  "오후 10:15",
  "오후 10:30",
  "오후 10:45",
  "오후 11:00",
  "오후 11:15",
  "오후 11:30",
  "오후 11:45",
];

const TimeBox = (props) => {
  const dispatch = useDispatch();

  const clickHandler = (timeinfo) => {
    dispatch(timeActions.startTimetoggle());
    dispatch(timeActions.selecFristTime(timeinfo));
  };

  return (
    <select id="time" size="5" defaultValue={props.currentTime}>
      <option id={value[0]} onClick={() => clickHandler(value[0])}>오전 00:00</option>
      <option id={value[1]} onClick={() => clickHandler(value[1])}>오전 00:15</option>
      <option id={value[2]} onClick={() => clickHandler(value[2])}>오전 00:30</option>
      <option id={value[3]} onClick={() => clickHandler(value[3])}>오전 00:45</option>
      <option id={value[4]} onClick={() => clickHandler(value[4])}>오전 01:00</option>
      <option id={value[5]} onClick={() => clickHandler(value[5])}>오전 01:15</option>
      <option id={value[6]} onClick={() => clickHandler(value[6])}>오전 01:30</option>
      <option id={value[7]} onClick={() => clickHandler(value[7])}>오전 01:45</option>
      <option id={value[8]} onClick={() => clickHandler(value[8])}>오전 02:00</option>
      <option id={value[9]} onClick={() => clickHandler(value[9])}>오전 02:15</option>
      <option id={value[10]} onClick={() => clickHandler(value[10])}>오전 02:30</option>
      <option id={value[11]} onClick={() => clickHandler(value[11])}>오전 02:45</option>
      <option id={value[12]} onClick={() => clickHandler(value[12])}>오전 03:00</option>
      <option id={value[13]} onClick={() => clickHandler(value[13])}>오전 03:15</option>
      <option id={value[14]} onClick={() => clickHandler(value[14])}>오전 03:30</option>
      <option id={value[15]} onClick={() => clickHandler(value[15])}>오전 03:45</option>
      <option id={value[16]} onClick={() => clickHandler(value[16])}>오전 04:00</option>
      <option id={value[17]} onClick={() => clickHandler(value[17])}>오전 04:15</option>
      <option id={value[18]} onClick={() => clickHandler(value[18])}>오전 04:30</option>
      <option id={value[19]} onClick={() => clickHandler(value[19])}>오전 04:45</option>
      <option id={value[20]} onClick={() => clickHandler(value[20])}>오전 05:00</option>
      <option id={value[21]} onClick={() => clickHandler(value[21])}>오전 05:15</option>
      <option id={value[22]} onClick={() => clickHandler(value[22])}>오전 05:30</option>
      <option id={value[23]} onClick={() => clickHandler(value[23])}>오전 05:45</option>
      <option id={value[24]} onClick={() => clickHandler(value[24])}>오전 06:00</option>
      <option id={value[25]} onClick={() => clickHandler(value[25])}>오전 06:15</option>
      <option id={value[26]} onClick={() => clickHandler(value[26])}>오전 06:30</option>
      <option id={value[27]} onClick={() => clickHandler(value[27])}>오전 06:45</option>
      <option id={value[28]} onClick={() => clickHandler(value[28])}>오전 07:00</option>
      <option id={value[29]} onClick={() => clickHandler(value[29])}>오전 07:15</option>
      <option id={value[30]} onClick={() => clickHandler(value[30])}>오전 07:30</option>
      <option id={value[31]} onClick={() => clickHandler(value[31])}>오전 07:45</option>
      <option id={value[32]} onClick={() => clickHandler(value[32])}>오전 08:00</option>
      <option id={value[33]} onClick={() => clickHandler(value[33])}>오전 08:15</option>
      <option id={value[34]} onClick={() => clickHandler(value[34])}>오전 08:30</option>
      <option id={value[35]} onClick={() => clickHandler(value[35])}>오전 08:45</option>
      <option id={value[36]} onClick={() => clickHandler(value[36])}>오전 09:00</option>
      <option id={value[37]} onClick={() => clickHandler(value[37])}>오전 09:15</option>
      <option id={value[38]} onClick={() => clickHandler(value[38])}>오전 09:30</option>
      <option id={value[39]} onClick={() => clickHandler(value[39])}>오전 09:45</option>
      <option id={value[40]} onClick={() => clickHandler(value[40])}>오전 10:00</option>
      <option id={value[41]} onClick={() => clickHandler(value[41])}>오전 10:15</option>
      <option id={value[42]} onClick={() => clickHandler(value[42])}>오전 10:30</option>
      <option id={value[43]} onClick={() => clickHandler(value[43])}>오전 10:45</option>
      <option id={value[44]} onClick={() => clickHandler(value[44])}>오전 11:00</option>
      <option id={value[45]} onClick={() => clickHandler(value[45])}>오전 11:15</option>
      <option id={value[46]} onClick={() => clickHandler(value[46])}>오전 11:30</option>
      <option id={value[47]} onClick={() => clickHandler(value[47])}>오전 11:45</option>
      <option id={value[48]} onClick={() => clickHandler(value[48])}>오후 00:00</option>
      <option id={value[49]} onClick={() => clickHandler(value[49])}>오후 00:15</option>
      <option id={value[50]} onClick={() => clickHandler(value[50])}>오후 00:30</option>
      <option id={value[51]} onClick={() => clickHandler(value[51])}>오후 00:45</option>
      <option id={value[52]} onClick={() => clickHandler(value[52])}>오후 01:00</option>
      <option id={value[53]} onClick={() => clickHandler(value[53])}>오후 01:15</option>
      <option id={value[54]} onClick={() => clickHandler(value[54])}>오후 01:30</option>
      <option id={value[55]} onClick={() => clickHandler(value[55])}>오후 02:45</option>
      <option id={value[56]} onClick={() => clickHandler(value[56])}>오후 02:00</option>
      <option id={value[57]} onClick={() => clickHandler(value[57])}>오후 02:15</option>
      <option id={value[58]} onClick={() => clickHandler(value[58])}>오후 02:30</option>
      <option id={value[59]} onClick={() => clickHandler(value[59])}>오후 02:45</option>
      <option id={value[60]} onClick={() => clickHandler(value[60])}>오후 03:00</option>
      <option id={value[61]} onClick={() => clickHandler(value[61])}>오후 03:15</option>
      <option id={value[62]} onClick={() => clickHandler(value[62])}>오후 03:30</option>
      <option id={value[63]} onClick={() => clickHandler(value[63])}>오후 03:45</option>
      <option id={value[64]} onClick={() => clickHandler(value[64])}>오후 04:00</option>
      <option id={value[65]} onClick={() => clickHandler(value[65])}>오후 04:15</option>
      <option id={value[66]} onClick={() => clickHandler(value[66])}>오후 04:30</option>
      <option id={value[67]} onClick={() => clickHandler(value[67])}>오후 04:45</option>
      <option id={value[68]} onClick={() => clickHandler(value[68])}>오후 05:00</option>
      <option id={value[69]} onClick={() => clickHandler(value[69])}>오후 05:15</option>
      <option id={value[70]} onClick={() => clickHandler(value[70])}>오후 05:30</option>
      <option id={value[71]} onClick={() => clickHandler(value[71])}>오후 05:45</option>
      <option id={value[72]} onClick={() => clickHandler(value[72])}>오후 06:00</option>
      <option id={value[73]} onClick={() => clickHandler(value[73])}>오후 06:15</option>
      <option id={value[74]} onClick={() => clickHandler(value[74])}>오후 06:30</option>
      <option id={value[75]} onClick={() => clickHandler(value[75])}>오후 06:45</option>
      <option id={value[76]} onClick={() => clickHandler(value[76])}>오후 07:00</option>
      <option id={value[77]} onClick={() => clickHandler(value[77])}>오후 07:15</option>
      <option id={value[78]} onClick={() => clickHandler(value[78])}>오후 07:30</option>
      <option id={value[79]} onClick={() => clickHandler(value[79])}>오후 07:45</option>
      <option id={value[80]} onClick={() => clickHandler(value[80])}>오후 08:00</option>
      <option id={value[81]} onClick={() => clickHandler(value[81])}>오후 08:15</option>
      <option id={value[82]} onClick={() => clickHandler(value[82])}>오후 08:30</option>
      <option id={value[83]} onClick={() => clickHandler(value[83])}>오후 08:45</option>
      <option id={value[84]} onClick={() => clickHandler(value[84])}>오후 09:00</option>
      <option id={value[85]} onClick={() => clickHandler(value[85])}>오후 09:15</option>
      <option id={value[86]} onClick={() => clickHandler(value[86])}>오후 09:30</option>
      <option id={value[87]} onClick={() => clickHandler(value[87])}>오후 09:45</option>
      <option id={value[88]} onClick={() => clickHandler(value[88])}>오후 10:00</option>
      <option id={value[89]} onClick={() => clickHandler(value[89])}>오후 10:15</option>
      <option id={value[90]} onClick={() => clickHandler(value[90])}>오후 10:30</option>
      <option id={value[91]} onClick={() => clickHandler(value[91])}>오후 10:45</option>
      <option id={value[92]} onClick={() => clickHandler(value[92])}>오후 11:00</option>
      <option id={value[93]} onClick={() => clickHandler(value[93])}>오후 11:15</option>
      <option id={value[94]} onClick={() => clickHandler(value[94])}>오후 11:30</option>
      <option id={value[95]} onClick={() => clickHandler(value[95])}>오후 11:45</option>
    </select>
  );
};

export default TimeBox;
