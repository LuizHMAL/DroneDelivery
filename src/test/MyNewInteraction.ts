import inquirer from 'inquirer';
import { createDrone, getAllDrones, getDroneById } from '../controller/droneController';
import { createPackage, getAllPackages, getPackageById } from '../controller/packageController';
import { createDelivery, getAllDeliveries, runDelivery } from '../controller/deliveryController';
import { createDeliveryAccurate } from '../controller/deliveryController';
import deliveryList from '../data/deliveryData';

function seedData() {
  createDrone('1', 'Phantom A', 10, 100, 80, 'available', 0, 0, 'high priority');
  createDrone('2', 'Phantom B', 15, 120, 90, 'available', 10, 10, 'medium priority');
  createDrone('3', 'Phantom C', 8, 80, 60, 'available', 5, 5, 'low priority');
  createPackage('1', 5, 30, 40, 0, 0, 'high');
  createPackage('2', 3, 20, 10, 10, 10, 'medium');
  createPackage('3', 7, 50, 60, 5, 5, 'low');
}

async function mainMenu() {
  console.clear();
  console.log('🚁 Sistema de Gerenciamento de Entregas por Drone 🚁\n');
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'O que você deseja fazer?',
      choices: [
        '📦 Listar Pacotes',
        '🚁 Listar Drones',
        '📍 Criar Entrega Precisão',
        '▶️ Iniciar e Completar Entrega',
        '➕ Criar Drone',
        '➕ Criar Pacote',
        '📄 Ver Entregas',
        '🚪 Sair',
      ],
    },
  ]);
  switch (answer.action) {
    case '📦 Listar Pacotes':
      listPackages();
      break;
    case '🚁 Listar Drones':
      listDrones();
      break;
    case '📍 Criar Entrega Precisão':
      await handleCreateDeliveryAccurate();
      break;
    case '▶️ Iniciar e Completar Entrega':
      await handleRunDelivery();
      break;
    case '➕ Criar Drone':
      await handleCreateDrone();
      break;
    case '➕ Criar Pacote':
      await handleCreatePackage();
      break;
    case '📄 Ver Entregas':
      listDeliveries();
      break;
    case '🚪 Sair':
      console.log('Encerrando o sistema...');
      process.exit();
  }
  await pauseAndReturn();
  await mainMenu();
}

function listDrones() {
  const drones = getAllDrones();
  console.log('\n🚁 Drones:');
  drones.forEach((drone) => {
    console.log(`- ID: ${drone.id}, Modelo: ${drone.model}, Status: ${drone.status}`);
  });
}

function listPackages() {
  const packages = getAllPackages().filter(p => p.status !== 'delivered');
  console.log('\n📦 Pacotes:');
  packages.forEach((pkg) => {
    console.log(`- ID: ${pkg.id}, Peso: ${pkg.weight}kg, Prioridade: ${pkg.priority}, Status: ${pkg.status}`);
  });
}

function listDeliveries() {
  const deliveries = getAllDeliveries();
  console.log('\n📄 Entregas:');
  if (deliveries.length === 0) {
    console.log('Nenhuma entrega cadastrada.');
    return;
  }
  deliveries.forEach((delivery) => {
    console.log(`- ID: ${delivery.id}, Drone: ${delivery.drone_id}, Pacote: ${delivery.package_id}, Status: ${delivery.status}, Preço: R$${delivery.totalPrice.toFixed(2)}`);
  });
}

async function handleCreateDelivery() {
  const drones = getAllDrones().filter((d) => d.status === 'available');
  const packages = getAllPackages();
  if (drones.length === 0 || packages.length === 0) {
    console.log('\n⚠️ Não há drones disponíveis ou pacotes cadastrados.');
    return;
  }
  const { droneId, packageId, status } = await inquirer.prompt([
    {
      type: 'list',
      name: 'droneId',
      message: 'Escolha o drone:',
      choices: drones.map((d) => ({ name: `ID ${d.id} - ${d.model}`, value: d.id })),
    },
    {
      type: 'list',
      name: 'packageId',
      message: 'Escolha o pacote:',
      choices: packages.map((p) => ({ name: `ID ${p.id} - ${p.weight}kg`, value: p.id })),
    },
    {
      type: 'list',
      name: 'status',
      message: 'Status da entrega:',
      choices: ['pending', 'in transit', 'delivered'],
    },
  ]);
  const result = createDelivery(droneId, packageId, status);
  console.log('\n📤 Resultado da criação da entrega:');
  console.log(result);
}

async function handleRunDelivery() {
  let pendingDeliveries = getAllDeliveries().filter(d => d.status === 'pending');
  if (pendingDeliveries.length === 0) {
    console.log('\n⚠️ Não há entregas pendentes para iniciar.');
    return;
  }
  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  pendingDeliveries.sort((a, b) => {
    const packageA = getPackageById(a.package_id);
    const packageB = getPackageById(b.package_id);
    const priorityA = packageA ? priorityOrder[packageA.priority] : 0;
    const priorityB = packageB ? priorityOrder[packageB.priority] : 0;
    return priorityB - priorityA;
  });
  const { deliveryId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'deliveryId',
      message: 'Selecione a entrega para iniciar e completar:',
      choices: pendingDeliveries.map(d => {
        const pkg = getPackageById(d.package_id);
        const drone = getDroneById(d.drone_id);
        return {
          name: `Entrega ${d.id} - Drone ${drone?.model || d.drone_id} / Pacote ${pkg?.id} (Prioridade: ${pkg?.priority || "N/A"})`,
          value: d.id,
        };
      }),
    },
  ]);
  const result = runDelivery(deliveryId);
  console.log('\n▶️ Resultado da entrega iniciada e completada:');
  console.log(result);
}

async function handleCreateDeliveryAccurate() {
  const packages = getAllPackages().filter(p => p.status !== 'delivered');

  if (packages.length === 0) {
    console.log('\n⚠️ Não há pacotes disponíveis para entrega de precisão.');
    return;
  }

  const { packageId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageId',
      message: 'Escolha o pacote para a entrega de precisão:',
      choices: packages.map((p) => ({ name: `ID ${p.id} - ${p.weight}kg (Prioridade: ${p.priority}, Status: ${p.status})`, value: p.id })),
    },
  ]);

  await createDeliveryAccurate(packageId);
}

async function handleCreateDrone() {
  const drones = getAllDrones();
  const nextId = drones.length > 0 ? String(Number(drones[drones.length - 1].id) + 1) : "1";

  const answers = await inquirer.prompt([
    { name: 'model', message: 'Modelo do drone:', type: 'input' },
    { name: 'maxWeight', message: 'Peso máximo (kg):', type: 'number' },
    { name: 'maxDistance', message: 'Distância máxima (km):', type: 'number' },
    { name: 'batteryLife', message: 'Bateria (%):', type: 'number' },
    { name: 'location_x', message: 'Posição X:', type: 'number' },
    { name: 'location_y', message: 'Posição Y:', type: 'number' },
    {
      name: 'droneType',
      message: 'Tipo de prioridade:',
      type: 'list',
      choices: ['low priority', 'medium priority', 'high priority'],
    },
  ]);

  const drone = createDrone(
    nextId,
    answers.model,
    answers.maxWeight,
    answers.maxDistance,
    answers.batteryLife,
    'available',
    answers.location_x,
    answers.location_y,
    answers.droneType
  );

  console.log(`\n🚁 Drone criado com sucesso (ID: ${nextId}):`, drone);
}

async function handleCreatePackage() {
  const packages = getAllPackages();
  const nextId = packages.length > 0 ? String(Number(packages[packages.length - 1].id) + 1) : "1";

  const answers = await inquirer.prompt([
    { name: 'weight', message: 'Peso (kg):', type: 'number' },
    { name: 'origin_x', message: 'Origem X:', type: 'number' },
    { name: 'origin_y', message: 'Origem Y:', type: 'number' },
    { name: 'destination_x', message: 'Destino X:', type: 'number' },
    { name: 'destination_y', message: 'Destino Y:', type: 'number' },
    {
      name: 'priority',
      message: 'Prioridade:',
      type: 'list',
      choices: ['low', 'medium', 'high'],
    },
  ]);

  const newPkg = createPackage(
    nextId,
    answers.weight,
    answers.destination_x,
    answers.destination_y,
    answers.origin_x,
    answers.origin_y,
    answers.priority
  );

  console.log(`\n📦 Pacote criado com sucesso (ID: ${nextId}):`, newPkg);
}

async function pauseAndReturn() {
  await inquirer.prompt([{ name: 'pause', message: '\nPressione ENTER para continuar...', type: 'input' }]);
}

seedData();
mainMenu();
