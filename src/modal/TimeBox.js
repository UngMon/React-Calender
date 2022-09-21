import { useDispatch } from "react-redux";
import { timeActions } from "../store/time-slice";

const TimeBox = (props) => {
  const dispatch = useDispatch()
  const clickHandler = () => {
    dispatch(timeActions.startTimetoggle());
  }

  return (
    <select name="time" id="time" size='5' defaultValue={props.currentTime}>
      <option value="오전 00:00" selected onClick={clickHandler}>오전 00:00</option>
      <option value="오전 00:15" selected onClick={clickHandler}>오전 00:15</option>
      <option value="오전 00:30" selected onClick={clickHandler}>오전 00:30</option>
      <option value="오전 00:45" selected onClick={clickHandler}>오전 00:45</option>

      <option value="오전 01:00" selected>오전 01:00</option>
      <option value="오전 01:15" selected>오전 01:15</option>
      <option value="오전 01:30" selected>오전 01:30</option>
      <option value="오전 01:45" selected>오전 01:45</option>

      <option value="오전 02:00" selected>오전 02:00</option>
      <option value="오전 02:15" selected>오전 02:15</option>
      <option value="오전 02:30" selected>오전 02:30</option>
      <option value="오전 02:45" selected>오전 02:45</option>

      <option value="오전 03:00" selected>오전 03:00</option>
      <option value="오전 03:15" selected>오전 03:15</option>
      <option value="오전 03:30" selected>오전 03:30</option>
      <option value="오전 03:45" selected>오전 03:45</option>

      <option value="오전 04:00" selected>오전 04:00</option>
      <option value="오전 04:15" selected>오전 04:15</option>
      <option value="오전 04:30" selected>오전 04:30</option>
      <option value="오전 04:45" selected>오전 04:45</option>

      <option value="오전 05:00" selected>오전 05:00</option>
      <option value="오전 05:15" selected>오전 05:15</option>
      <option value="오전 05:30" selected>오전 05:30</option>
      <option value="오전 05:45" selected>오전 05:45</option>

      <option value="오전 06:00" selected>오전 06:00</option>
      <option value="오전 06:15" selected>오전 06:15</option>
      <option value="오전 06:30" selected>오전 06:30</option>
      <option value="오전 06:45" selected>오전 06:45</option>

      <option value="오전 07:00" selected>오전 07:00</option>
      <option value="오전 07:15" selected>오전 07:15</option>
      <option value="오전 07:30" selected>오전 07:30</option>
      <option value="오전 07:45" selected>오전 07:45</option>

      <option value="오전 08:00" selected>오전 08:00</option>
      <option value="오전 08:15" selected>오전 08:15</option>
      <option value="오전 08:30" selected>오전 08:30</option>
      <option value="오전 08:45" selected>오전 08:45</option>

      <option value="오전 09:00" selected>오전 09:00</option>
      <option value="오전 09:15" selected>오전 09:15</option>
      <option value="오전 09:30" selected>오전 09:30</option>
      <option value="오전 09:45" selected>오전 09:45</option>

      <option value="오전 10:00" selected>오전 10:00</option>
      <option value="오전 10:15" selected>오전 10:15</option>
      <option value="오전 10:30" selected>오전 10:30</option>
      <option value="오전 10:45" selected>오전 10:45</option>

      <option value="오전 11:00" selected>오전 11:00</option>
      <option value="오전 11:15" selected>오전 11:15</option>
      <option value="오전 11:30" selected>오전 11:30</option>
      <option value="오전 11:45" selected>오전 11:45</option>

      <option value="오후 00:00" selected>오후 00:00 </option>
      <option value="오후 00:15" selected>오후 00:15 </option>
      <option value="오후 00:30" selected>오후 00:30 </option>
      <option value="오후 00:45" selected>오후 00:45 </option>

      <option value="오후 01:00" selected>오후 01:00</option>
      <option value="오후 01:15" selected>오후 01:15</option>
      <option value="오후 01:30" selected>오후 01:30</option>
      <option value="오후 01:45" selected>오후 02:45</option>

      <option value="오후 02:00" selected>오후 02:00</option>
      <option value="오후 02:15" selected>오후 02:15</option>
      <option value="오후 02:30" selected>오후 02:30</option>
      <option value="오후 02:45" selected>오후 02:45</option>

      <option value="오후 03:00" selected>오후 03:00</option>
      <option value="오후 03:15" selected>오후 03:15</option>
      <option value="오후 03:30" selected>오후 03:30</option>
      <option value="오후 03:45" selected>오후 03:45</option>

      <option value="오후 04:00" selected>오후 04:00</option>
      <option value="오후 04:15" selected>오후 04:15</option>
      <option value="오후 04:30" selected>오후 04:30</option>
      <option value="오후 04:45" selected>오후 04:45</option>

      <option value="오후 05:00" selected>오후 05:00</option>
      <option value="오후 05:15" selected>오후 05:15</option>
      <option value="오후 05:30" selected>오후 05:30</option>
      <option value="오후 05:45" selected>오후 05:45</option>

      <option value="오후 06:00" selected>오후 06:00</option>
      <option value="오후 06:15" selected>오후 06:15</option>
      <option value="오후 06:30" selected>오후 06:30</option>
      <option value="오후 06:45" selected>오후 06:45</option>

      <option value="오후 07:00" selected>오후 07:00</option>
      <option value="오후 07:15" selected>오후 07:15</option>
      <option value="오후 07:30" selected>오후 07:30</option>
      <option value="오후 07:45" selected>오후 07:45</option>

      <option value="오후 08:00" selected>오후 08:00</option>
      <option value="오후 08:15" selected>오후 08:15</option>
      <option value="오후 08:30" selected>오후 08:30</option>
      <option value="오후 08:45" selected>오후 08:45</option>

      <option value="오후 09:00" selected>오후 09:00</option>
      <option value="오후 09:15" selected>오후 09:15</option>
      <option value="오후 09:30" selected>오후 09:30</option>
      <option value="오후 09:45" selected>오후 09:45</option>

      <option value="오후 10:00" selected>오후 10:00</option>
      <option value="오후 10:15" selected>오후 10:15</option>
      <option value="오후 10:30" selected>오후 10:30</option>
      <option value="오후 10:45" selected>오후 10:45</option>

      <option value="오후 11:00" selected>오후 11:00</option>
      <option value="오후 11:15" selected>오후 11:15</option>
      <option value="오후 11:30" selected>오후 11:30</option>
      <option value="오후 11:45" selected>오후 11:45</option>
    </select>
  );
};

export default TimeBox;
