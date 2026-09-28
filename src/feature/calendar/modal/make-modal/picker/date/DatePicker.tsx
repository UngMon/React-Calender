import { OpenPikcer } from "@/store/useGhostEventStore";
import MiniCalendar from "./MiniCalendar";

interface Props {
  type: "make" | "edit";
  order: "start" | "end";
  start_date: string;
  end_date: string;
  openPicker: OpenPikcer;
  setOpenPicker: (category: "time" | "date", order: "start" | "end") => void;
}

const DatePicker = ({
  type,
  order,
  start_date,
  end_date,
  openPicker,
  setOpenPicker,
}: Props) => {
  const { category, device, order: orderPicker } = openPicker!;

  const openMiniCalender: boolean =
    order === orderPicker && device === "pc" && category === "date";

  const handleClick = () => setOpenPicker("date", order);

  return (
    <div className="time-date-box__field">
      <button
        type="button"
        className={`time-date-box__date-button ${openMiniCalender ? "is-active" : ""}`}
        onClick={handleClick}
      >
        {order === "start" ? start_date : end_date}
      </button>
      {openMiniCalender && (
        <MiniCalendar
          type={type}
          order={order}
          start_date={start_date}
          end_date={end_date}
        />
      )}
    </div>
  );
};

export default DatePicker;
