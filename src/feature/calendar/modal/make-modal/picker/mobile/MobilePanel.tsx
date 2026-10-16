import { OpenPikcer } from "@/store/useGhostEventStore";
import MobileTimePicker from "./MobileTimePicker";
import MiniCalendar from "../date/MiniCalendar";
import "./MobilePanel.css";

interface Props {
  type: "make" | "edit";
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  openPicker: OpenPikcer;
}

const MobilePanel = ({
  type,
  start_date,
  end_date,
  start_time,
  end_time,
  openPicker,
}: Props) => {
  const { category, order, device } = openPicker;

  const innerWidth = window.innerWidth;
  const openMobilePanel: boolean = device === "mo" ? true : false;

  return (
    <div
      className={`time-date-box__mobile-panel ${openMobilePanel ? "is-active" : ""}`}
    >
      <div className="time-date-box__mobile-panel-inner">
        {category === "time" && (
          <MobileTimePicker
            type={type}
            order={order}
            start_time={start_time}
            end_time={end_time}
          />
        )}
        {category === "date" && (
          <MiniCalendar
            type={type}
            order={order}
            start_date={start_date}
            end_date={end_date}
          />
        )}
      </div>
    </div>
  );
};

export default MobilePanel;
