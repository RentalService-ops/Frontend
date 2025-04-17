import { Modal, Button } from "react-bootstrap";

export default function EditEquipmentForm({showEditModal,handleSaveEdit,setEditedEquipment,setShowEditModal,editedEquipment}) {

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditedEquipment({ ...editedEquipment, imagePreview: reader.result, imageFile: file });
        };
        reader.readAsDataURL(file);
    }
};

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editedEquipment && (
          <div className="row">
            <div className="col-md-7">
              {/* Hidden Input for Equipment ID */}
              <input type="hidden" value={editedEquipment.equipmentId} />

              <label>Name</label>
              <input
                type="text"
                className="form-control mb-2"
                value={editedEquipment.name}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, name: e.target.value })}
              />

              <label>Price Per Day</label>
              <input
                type="number"
                className="form-control mb-2"
                value={editedEquipment.pricePerDay}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, pricePerDay: e.target.value })}
              />

              <label>Quantity</label>
              <input
                type="number"
                className="form-control mb-2"
                value={editedEquipment.quantity}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, quantity: e.target.value })}
              />

              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={editedEquipment.description}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, description: e.target.value })}
              ></textarea>
            </div>
            <div className="col-md-5">
              <img src={editedEquipment.imagePreview} alt="equipment" className="img-fluid mb-2" />
              <input type="file" className="form-control" onChange={handleImageChange} />
            </div>
          </div>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={()=>handleSaveEdit()}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}