import Delivery from "../model/delivery";
import deliveryList from "../data/deliveryData";
import Drone from "../model/drone";
import { getDroneById } from "./droneController";
import Package from "../model/package";
import { getPackageById } from "./packageController";


type DeliveryStatus = 'pending' | 'in transit' | 'delivered';

export function createDelivery(drone_id: number, package_id: number, status: DeliveryStatus): Delivery | string {
    const drone: Drone | undefined = getDroneById(drone_id);
    const packageItem: Package | undefined = getPackageById(package_id);
    if (!drone) {
        return `Drone with ID ${drone_id} not found.`;
    }   
    if (!packageItem) {
        return `Package with ID ${package_id} not found.`;
    }
    if (drone.status !== 'available') {
        return `Drone with ID ${drone_id} is not available.`;
    }
    if (packageItem.weight > drone.maxWeight) {
        return `Package weight exceeds drone's maximum weight capacity.`;
    }
    const distance = calculateDistance(packageItem, drone);
    if (distance > drone.maxDistance) {
        return `Package destination exceeds drone's maximum distance capacity.`;
    }
    const newDelivery = new Delivery({
        id: deliveryList.length + 1,
        drone_id,
        package_id,
        status: status || 'pending',
        totalPrice:  (packageItem.weight ) * (distance), 
      
    });
    deliveryList.push(newDelivery);
    drone.status = 'flying';
    return newDelivery;
}

function calculateDistance(packageItem: Package, drone: Drone): number {
    const deliveryPath: number = Math.sqrt(
        Math.pow(packageItem.destination_x - packageItem.origin_x, 2) +
        Math.pow(packageItem.destination_y - packageItem.origin_y, 2)+
        Math.pow(drone.location_x - packageItem.origin_x, 2) +
        Math.pow(drone.location_y - packageItem.origin_y, 2)
    );
    return deliveryPath;
}
