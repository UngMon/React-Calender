import { useTimeDateStore } from "@/store/useTimeDateStore";
import MobileTimePicker from "../../mobile/MobileTimePicker";
import MiniCalendar from "../../../MiniCalendar/MiniCalendar";

interface Props {
  isExpanded: boolean;
}

const MobilePanel = ({ isExpanded }: Props) => {
  const activeDatePicker = useTimeDateStore((state) => state.activeDatePicker);
  const activeTimePicker = useTimeDateStore((state) => state.activeTimePicker);

  return (
    <div
      className={`time-date-box__mobile-panel ${isExpanded ? "is-active" : ""}`}
    >
      <div className="time-date-box__mobile-panel-inner">
        {activeTimePicker?.device === "mobile" && (
          <MobileTimePicker order={activeTimePicker!.order} />
        )}
        {activeDatePicker?.device === "mobile" && (
          <MiniCalendar order={activeDatePicker!.order} />
        )}
      </div>
    </div>
  );
};

export default MobilePanel;
