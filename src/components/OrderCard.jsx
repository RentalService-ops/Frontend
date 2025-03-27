import {Card,Button } from "react-bootstrap";
const OrderCard = ({ order, onConfirmCancel }) => {
    return (
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold text-primary">
            {/* {equipmentData[order.equipmentId]?.name || "Loading Equipment..."} */}
            {order.equipmentName || "Loading Equipment..."}
          </Card.Title>
          <Card.Text>
            <strong>Quantity:</strong> {order.equipmentQuantity}
          </Card.Text>
          <Card.Text>
            <strong>Total Price:</strong> ₹{order.totalAmount}
          </Card.Text>
          <Card.Text>
            <strong>Status:</strong> {order.status}
          </Card.Text>
  
          {order.status === "PENDING" && (
            <Button variant="danger" onClick={() => onConfirmCancel(order.bookingId)}>
              Cancel Order
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };

export default OrderCard;