type DroneStatus = 'available' | 'flying';
type DroneType = "low priority" | "medium priority" | "high priority";

interface DroneProps {
    id: number;
    model: string;
    maxWeight: number;
    maxDistance: number;
    batteryLife: number;
    status: DroneStatus;
    location_x: number;
    location_y: number;
    droneType: DroneType;
}

class Drone {
    id: number;
    model: string;
    maxWeight: number;
    maxDistance: number;
    batteryLife: number;
    status: DroneStatus;
    location_x: number;
    location_y: number;
    droneType: DroneType;

    constructor({ id, model, maxWeight, maxDistance, batteryLife, status, location_x, location_y, droneType }: DroneProps) {
        this.id = id;
        this.model = model;
        this.maxWeight = maxWeight;
        this.maxDistance = maxDistance;
        this.batteryLife = batteryLife;
        this.status = status;
        this.location_x = location_x;
        this.location_y = location_y;
        this.droneType = droneType;
    }
}

export default Drone;

