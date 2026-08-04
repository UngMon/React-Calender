import { formatDisplayTime } from "@/utils/formatTime";
import { useTimeDateStore } from "@/store/useTimeDateStore";
import PcTimePicker from "../../pc/PcTimePicker";

interface Props {
  order: "start" | "end";
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeBox = ({ order, setIsExpanded }: Props) => {
  const startTime = useTimeDateStore((state) => state.startTime);
  const endTime = useTimeDateStore((state) => state.endTime);
  const clickTime = useTimeDateStore((state) => state.clickTime);
  const activeTimePicker = useTimeDateStore((state) => state.activeTimePicker);

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
        {formatDisplayTime(order === "start" ? startTime : endTime)}
      </button>
      {activeTimePicker?.order === order &&
        activeTimePicker?.device === "pc" && (
          <PcTimePicker order={order} startTime={startTime} endTime={endTime} />
        )}
    </div>
  );
};

export default TimeBox;
