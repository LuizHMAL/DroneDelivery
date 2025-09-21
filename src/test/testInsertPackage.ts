import {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage
} from '../controller/packageController';

createPackage('1', 4.5, 10, 20, 0, 0, 'medium');
createPackage('2', 3, 15, 25, 2, 2, 'high');

console.log(getAllPackages());
