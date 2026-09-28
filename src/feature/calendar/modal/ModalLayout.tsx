import { useMakeModalStore } from "@/store/useMakeModalStore";
import { useDetailModalStore } from "@/store/useDetailModalStore";
import MakeEvent from "./make-modal/MakeEvent";
import EventDetailModal from "./event-modal/EventDetailModal";

const ModalLayout = () => {
  const { openMakeModal, ...restOne } = useMakeModalStore();
  const { openDetailModal, ...restTwo } = useDetailModalStore();
  console.log(openMakeModal, restOne)
  return (
    <div className="modal-layout">
      {openMakeModal && <MakeEvent options={restOne} />}
      {openDetailModal && <EventDetailModal options={{ ...restTwo }} />}
    </div>
  );
};

export default ModalLayout;
