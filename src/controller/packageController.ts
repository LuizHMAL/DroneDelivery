import packageList from "../data/packageData";
import DeliveryPackage from "../model/package";

type Priority = 'low' | 'medium' | 'high';

export function createPackage(
    package_id: string,
    weight: number,
    destination_x: number,
    destination_y: number,
    origin_x: number,
    origin_y: number,
    priority: Priority
): DeliveryPackage {
    const newPackage = new DeliveryPackage({
        id: parseInt(package_id),
        weight,
        destination_x,
        destination_y,
        origin_x,
        origin_y,
        priority
    });

    packageList.push(newPackage);
    return newPackage;
}

export function getAllPackages(): DeliveryPackage[] {
    return packageList;
}

export function getPackageById(id: number): DeliveryPackage | undefined {
    return packageList.find(packageItem => packageItem.id === id);
}

export function updatePackage(id: number, updatedFields: Partial<Omit<DeliveryPackage, 'id'>>): DeliveryPackage | undefined {
    const packageItem = packageList.find(p => p.id === id);
    if (packageItem) {
        Object.assign(packageItem, updatedFields);
        return packageItem;
    }
    return undefined;
}

export function deletePackage(id: number): boolean {
    const index = packageList.findIndex(p => p.id === id);
    if (index !== -1) {
        packageList.splice(index, 1);
        return true;
    }
    return false;
}
