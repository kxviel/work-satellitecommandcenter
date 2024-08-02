import { useAppSelector } from "../../Redux/hooks";
import ConfirmationModal from "./ConfirmationModal";

const ConfirmationModalWrapper = () => {
  const showChangeConfirmModal = useAppSelector(
    (state) => state.response.showChangeConfirmModal
  );

  return (
    <>
      {showChangeConfirmModal.show && (
        <ConfirmationModal data={showChangeConfirmModal} />
      )}
    </>
  );
};
export default ConfirmationModalWrapper;
