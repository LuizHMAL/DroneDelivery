import { createDrone, getAllDrones, getDroneById, updateDrone, deleteDrone } from '../controller/droneController';

// Criar drones
createDrone('1', 'DJI Phantom', 2.5, 15, 90, 'available', 0, 0, 'low priority');
createDrone('2', 'Mavic Air', 3.0, 20, 80, 'flying', 5, 10, 'medium priority');
createDrone('3', 'Parrot Anafi', 1.8, 12, 95, 'available', -3, 2, 'high priority');

console.log('--- Lista de drones ---');
console.log(getAllDrones());

console.log('--- Buscar drone por ID 2 ---');
console.log(getDroneById(2));

console.log('--- Atualizar drone ID 1 (status e location) ---');
updateDrone(1, { status: 'flying', location_x: 10, location_y: 5 });
console.log(getDroneById(1));

console.log('--- Deletar drone ID 3 ---');
deleteDrone(3);
console.log(getAllDrones());
