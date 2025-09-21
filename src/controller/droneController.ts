import Drone from '../model/drone';
import droneList from '../data/droneData';

type DroneStatus = 'available' | 'flying';
type DroneType = "low priority" | "medium priority" | "high priority";


export function createDrone(
    drone_id: string,
    model: string,
    maxWeight: number,
    maxDistance: number,
    batteryLife: number,
    status: DroneStatus,
    location_x: number,
    location_y: number,
    droneType: DroneType
): Drone {
    const newDrone = new Drone({
        id: parseInt(drone_id),
        model,
        maxWeight,
        maxDistance,
        batteryLife,
        status: status || 'available',
        location_x, 
        location_y, 
        droneType
    });

    droneList.push(newDrone);
    return newDrone;
}

export function getAllDrones(): Drone[] {
    return droneList;
}


export function getDroneById(id: number): Drone | undefined {
    return droneList.find(drone => drone.id === id);
}


export function updateDrone(id: number, updatedFields: Partial<Omit<Drone, 'id'>>): Drone | undefined {
    const drone = droneList.find(d => d.id === id);
    if (drone) {
        Object.assign(drone, updatedFields);
        return drone;
    }
    return undefined;
}


export function deleteDrone(id: number): boolean {
    const index = droneList.findIndex(d => d.id === id);
    if (index !== -1) {
        droneList.splice(index, 1);
        return true;
    }
    return false;
}
