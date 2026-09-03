import { formatDisplayTime } from "@/utils/formatTime";
import { useTimeStore } from "@/store/useTimeStore";
import PcTimePicker from "./PcTimePicker";

interface Props {
  order: "start" | "end";
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimePicker = ({ order, setIsExpanded }: Props) => {
  const start_time = useTimeStore((state) => state.start_time);
  const end_time = useTimeStore((state) => state.end_time);
  const clickTime = useTimeStore((state) => state.clickTime);
  const activeTimePicker = useTimeStore((state) => state.activeTimePicker);

  const handleClick = () => {
    setTimeout(() => {
      setIsExpanded(true);
    }, 200);
    clickTime(order);
  };

  return (
    <div className="time-date-box__field">
      <button
        type="button"
        className="time-date-box__time-button"
        onClick={handleClick}
      >
        {formatDisplayTime(order === "start" ? start_time : end_time)}
      </button>
      {activeTimePicker?.order === order &&
        activeTimePicker?.device === "pc" && (
          <PcTimePicker
            order={order}
            start_time={start_time}
            end_time={end_time}
          />
        )}
    </div>
  );
};

export default TimePicker;
