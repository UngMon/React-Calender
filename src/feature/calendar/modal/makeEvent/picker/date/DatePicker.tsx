import { useDateStore } from "@/store/useDateStore";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import MiniCalendar from "./MiniCalendar";

interface Props {
  order: "start" | "end";
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatePicker = ({ order, setIsExpanded }: Props) => {
  const { open, setDate } = useDateStore();
  const ghostEvent = useGhostEventStore((state) => state.ghostEvent);
  const device = window.innerWidth >= 1024 ? "pc" : "mobile";

  const handleClick = () => {
    if (device === "mobile") setIsExpanded(true);
    setDate(order);
  };

  return (
    <div className="time-date-box__field">
      <button
        type="button"
        className={`time-date-box__date-button ${open === order ? "is-active" : ""}`}
        onClick={handleClick}
      >
        {order === "start" ? ghostEvent?.start_date : ghostEvent?.end_date}
      </button>
      {open === order && device === "pc" && <MiniCalendar order={order} />}
    </div>
  );
};

export default DatePicker;
