type DeliveryStatus = 'pending' | 'in transit' | 'delivered';

interface DeliveryProps{
    id: number;
    drone_id: number;
    package_id: number;
    totalPrice: number;
    status: DeliveryStatus;

}

class Delivery {
    id: number;
    drone_id: number;
    package_id: number;
    totalPrice: number;
    status: DeliveryStatus;

    constructor({id, drone_id, package_id, totalPrice, status}: DeliveryProps) {
        this.id = id;
        this.drone_id = drone_id;
        this.package_id = package_id;
        this.totalPrice = totalPrice;
        this.status = status;
    }
}
export default Delivery;