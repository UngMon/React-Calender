import { useModalStore } from "@/store/useModalStore";
import MakeEvent from "./make-modal/MakeEvent";
import EventDetailModal from "./event-modal/EventDetailModal";

const ModalLayout = () => {
  const { openModal, event_data, ...rest } = useModalStore();

  return (
    <div className="modal-layout">
      {openModal === "make" && <MakeEvent options={rest} />}
      {openModal === "detail" && (
        <EventDetailModal options={{ ...rest, event_data }} />
      )}
    </div>
  );
};

export default ModalLayout;
