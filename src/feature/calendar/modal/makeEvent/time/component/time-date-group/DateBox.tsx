import { useTimeDateStore } from "@/store/useTimeDateStore";
import MiniCalendar from "../../../MiniCalendar/MiniCalendar";

interface Props {
  order: "start" | "end";
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateBox = ({ order, setIsExpanded }: Props) => {
  const startDate = useTimeDateStore((state) => state.startDate);
  const endDate = useTimeDateStore((state) => state.endDate);
  const clickDate = useTimeDateStore((state) => state.clickDate);
  const activeDatePicker = useTimeDateStore((state) => state.activeDatePicker);
  console.log("DateBox", order, activeDatePicker);
  const handleClick = () => {
    setIsExpanded(true);
    clickDate(order);
  };

  return (
    <div className="time-date-box__field">
      <button
        type="button"
        className={`time-date-box__date-button ${activeDatePicker?.order === order ? "is-active" : ""}`}
        onClick={handleClick}
      >
        {order === "start" ? startDate : endDate}
      </button>
      {activeDatePicker?.order === order &&
        activeDatePicker?.device === "pc" && <MiniCalendar order={order} />}
    </div>
  );
};

export default DateBox;
