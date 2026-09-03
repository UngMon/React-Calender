import { useTimeStore } from "@/store/useTimeStore";
import MobileTimePicker from "./MobileTimePicker";
import MiniCalendar from "../date/MiniCalendar";
import { useDateStore } from "@/store/useDateStore";

interface Props {
  isExpanded: boolean;
}

const MobilePanel = ({ isExpanded }: Props) => {
  const isDateOpen = useDateStore((state) => state.open);
  const activeTimePicker = useTimeStore((state) => state.activeTimePicker);

  return (
    <div
      className={`time-date-box__mobile-panel ${isExpanded ? "is-active" : ""}`}
    >
      <div className="time-date-box__mobile-panel-inner">
        {activeTimePicker?.device === "mobile" && (
          <MobileTimePicker order={activeTimePicker!.order} />
        )}
        {isDateOpen === "mobile" && (
          <MiniCalendar order={isDateOpen} />
        )}
      </div>
    </div>
  );
};

export default MobilePanel;
