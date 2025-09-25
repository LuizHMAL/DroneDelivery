🚁 Drone Delivery System

Um sistema de gerenciamento de entregas por drones, desenvolvido em Node.js + TypeScript, com suporte a:
✅ Sistema de coordenadas X, Y para simular entregas.
✅ Priorização de entregas com base na urgência do pacote.
✅ Restrições de peso máximo e distância máxima por drone.
✅ Pacotes com origem e destino definidos.
✅ Atribuição automática do pacote ao drone mais adequado.

📂 Estrutura do Projeto
src/
 ├── controller/         # Lógica principal de drones, pacotes e entregas
 ├── data/               # Dados de exemplo (mock)
 ├── test/               # Interações e simulações
 └── mainMenu.ts         # Interface principal em modo CLI

⚙️ Pré-requisitos

Node.js
 (>= 18.x recomendado)

TypeScript

ts-node
 para rodar diretamente no terminal

Instale as dependências:

npm install

▶️ Como rodar o projeto

Para iniciar o sistema em modo CLI interativo, execute no terminal:

npx ts-node src/test/MyNewInteraction.ts


Você verá um menu como este:

🚁 Sistema de Gerenciamento de Entregas por Drone 🚁

? O que você deseja fazer?
  📦 Listar Pacotes
  🚁 Listar Drones
  📍 Criar Entrega Precisão
  ▶️ Iniciar e Completar Entrega
  ➕ Criar Drone
  ➕ Criar Pacote
  📄 Ver Entregas
  🚪 Sair

🛠️ Funcionalidades
📦 Pacotes

Possuem peso, prioridade, origem e destino.

Não podem ultrapassar a capacidade do drone que os transporta.

🚁 Drones

Cada drone possui:

Modelo

Capacidade máxima de peso

Distância máxima de entrega

Bateria

Localização inicial (X, Y)

Podem estar nos estados: available, flying, in transit.

📍 Entregas

O sistema seleciona o drone mais adequado para o pacote, considerando peso, distância e prioridade.

Entregas podem ser criadas manualmente ou via entrega de precisão (seleção automática).

O fluxo de uma entrega é:

pending → in transit → delivered

🧪 Exemplos de uso

Criar um novo drone:
Escolha ➕ Criar Drone e insira os atributos solicitados.

Criar um novo pacote:
Escolha ➕ Criar Pacote e defina origem, destino, peso e prioridade.

Criar uma entrega com precisão:
Escolha 📍 Criar Entrega Precisão → o sistema sugere o drone mais adequado.

Rodar entregas pendentes:
Escolha ▶️ Iniciar e Completar Entrega → o sistema processa pela ordem de prioridade (high > medium > low).

📌 Regras de Negócio

O drone não pode carregar pacotes acima do peso máximo.

A distância da entrega não pode ultrapassar a autonomia do drone.

A escolha do drone segue:

Prioridade do pacote (high > medium > low).

Drone disponível mais próximo da origem.

Respeito às restrições de peso e distância.

🚀 Melhorias Futuras

Persistência em banco de dados (atualmente in-memory).

Dashboard visual (web) para simular rotas em um plano cartesiano.

Algoritmo de otimização de entregas múltiplas.
