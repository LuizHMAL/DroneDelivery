export type Priority = 'low' | 'medium' | 'high';

export interface PackageProps {
    id: number;
    weight: number;
    destination_x: number;
    destination_y: number;
    origin_x: number;
    origin_y: number;
    priority: Priority;
}

class Package {
    id: number;
    weight: number;
    destination_x: number;
    destination_y: number;
    origin_x: number;
    origin_y: number;
    priority: Priority;

    constructor({ id, weight, destination_x, destination_y, origin_x, origin_y, priority }: PackageProps) {
        this.id = id;
        this.weight = weight;
        this.destination_x = destination_x;
        this.destination_y = destination_y;
        this.origin_x = origin_x;
        this.origin_y = origin_y;
        this.priority = priority;
    }
}

export default Package;
