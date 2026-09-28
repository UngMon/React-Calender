import { OpenPikcer } from "@/store/useGhostEventStore";
import { formatDisplayTime } from "@/utils/formatTime";
import PcTimePicker from "./PcTimePicker";

interface Props {
  type: "make" | "edit";
  order: "start" | "end";
  start_time: string;
  end_time: string;
  openPicker: OpenPikcer;
  setOpenPicker: (category: "time" | "date", order: "start" | "end") => void;
}

const TimePicker = ({
  type,
  order,
  start_time,
  end_time,
  openPicker,
  setOpenPicker,
}: Props) => {
  const { category, order: orderPicker, device } = openPicker!;

  const openTimePicker: boolean =
    order === orderPicker && device === "pc" && category === "time";

  const handleClick = () => setOpenPicker("time", order);

  return (
    <div className="time-date-box__field">
      <button
        type="button"
        className="time-date-box__time-button"
        onClick={handleClick}
      >
        {formatDisplayTime(order === "start" ? start_time : end_time)}
      </button>
      {openTimePicker && (
        <PcTimePicker
          type={type}
          order={order}
          start_time={start_time}
          end_time={end_time}
          setOpenPicker={setOpenPicker}
        />
      )}
    </div>
  );
};

export default TimePicker;
