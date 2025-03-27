import { MdCancel } from "react-icons/md";

export default function ConfirmationModal({ visible, onClose, onConfirm, actionType }) {
    if (!visible) return null;
  
    return (
      <div className="modal show" style={{ display: "block", background:"rgba(0, 0, 0, 0.5)" }} onClick={onClose}>
        <div className="modal-dialog " onClick={(e) => e.stopPropagation()}>
          <div className="modal-content " style={{top:"100px"}}>
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">{actionType === "approve" ? "Approve" : "Reject"} Booking</h5>
              <button type="button" onClick={onClose} style={{backgroundColor:"white",border:"0px"}}>
              <MdCancel />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to {actionType === "approve" ? "approve" : "reject"} this booking?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  