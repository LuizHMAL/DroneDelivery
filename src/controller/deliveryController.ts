import { PackageProps, Priority } from './../model/package';
import Delivery from "../model/delivery";
import deliveryList from "../data/deliveryData";
import Drone from "../model/drone";
import { getDroneById } from "./droneController";
import Package from "../model/package";
import { getPackageById } from "./packageController";
import { getAllDrones } from "./droneController";


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
    const droneToOrigin = Math.sqrt(
        Math.pow(drone.location_x - packageItem.origin_x, 2) +
        Math.pow(drone.location_y - packageItem.origin_y, 2)
    );

    const originToDestination = Math.sqrt(
        Math.pow(packageItem.destination_x - packageItem.origin_x, 2) +
        Math.pow(packageItem.destination_y - packageItem.origin_y, 2)
    );

    return droneToOrigin + originToDestination;
}


export function runDelivery(deliveryId: number): Delivery | string {
    const delivery = deliveryList.find(d => d.id === deliveryId);
    if (!delivery) {
        return `Delivery with ID ${deliveryId} not found.`;
    }
    if (delivery.status !== 'pending') {
        return `Delivery with ID ${deliveryId} cannot be started. Current status: ${delivery.status}.`;
    }
    const drone = getDroneById(delivery.drone_id);
    if (drone) {
        drone.status = 'flying';
    }
    delivery.status = 'in transit';

    const pkg = getPackageById(delivery.package_id);
    if (pkg) {
        pkg.status = 'in transit';
    }
    return completeDelivery(deliveryId);
}
function completeDelivery(deliveryId: number): Delivery | string {
    const delivery = deliveryList.find(d => d.id === deliveryId);   
    if (!delivery) {
        return `Delivery with ID ${deliveryId} not found.`;
    }
    if (delivery.status !== 'in transit') {
        return `Delivery with ID ${deliveryId} cannot be completed. Current status: ${delivery.status}.`;
    }
    const drone = getDroneById(delivery.drone_id);
    if (drone) {
        drone.status = 'available';
      
        const packageItem = getPackageById(delivery.package_id);
        if (packageItem) {
            drone.location_x = packageItem.destination_x;
            drone.location_y = packageItem.destination_y;

            packageItem.status = 'delivered';   
        }
    }


    
    
    delivery.status = 'delivered';
    return delivery;
}

export function getAllDeliveries(): Delivery[] {
    return deliveryList;
}

 function selectDronesForDelivery(drones: Drone[], packageItem: Package): Drone[] {
 
  let filteredDrones = drones.filter(drone => drone.droneType === `${packageItem.priority} priority`);

  filteredDrones = filteredDrones.filter(drone => drone.status === 'available');

  filteredDrones = filteredDrones.filter(drone => drone.maxWeight >= packageItem.weight);

  const dronesWithinDistance = filteredDrones.filter(drone => {
    const totalDistance = calculateDistance(packageItem, drone);
    return totalDistance <= drone.maxDistance;
  });


  dronesWithinDistance.sort((a, b) => {
    const distanceA = Math.sqrt(
      Math.pow(a.location_x - packageItem.origin_x, 2) +
      Math.pow(a.location_y - packageItem.origin_y, 2)
    );
    const distanceB = Math.sqrt(
      Math.pow(b.location_x - packageItem.origin_x, 2) +
      Math.pow(b.location_y - packageItem.origin_y, 2)
    );
    return distanceA - distanceB;
  });

  return dronesWithinDistance;
}


export function createDeliveryAccurate(packageId: number) {
  const packageItem = getPackageById(packageId);
  
  if (!packageItem) {
    console.log(`Pacote com ID ${packageId} não encontrado.`);
    return;
  }

 
  const drones = getAllDrones();
  
  
  const availableDrones = selectDronesForDelivery(drones, packageItem);

  if (availableDrones.length === 0) {
    console.log("Nenhum drone disponível para essa entrega.");
    return;
  }

  
  const selectedDrone = availableDrones[0];

  console.log(`Drone selecionado: ID ${selectedDrone.id} - ${selectedDrone.model}`);


  const result = createDelivery(selectedDrone.id, packageId, 'pending');
  
  console.log('\n📤 Resultado da criação da entrega:');
  console.log(result);
}
