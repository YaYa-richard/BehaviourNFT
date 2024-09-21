# EthoSphere

EthoSphere is a decentralized platform built using **Hardhat**, **React**, **MongoDB**, and **IPFS** to create and manage dynamic NFTs based on user behavior. It includes a backend, frontend, and smart contracts deployed on the **Hardhat testnet**.

## Prerequisites

Before running the project, ensure that the following software is installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [MongoDB](https://www.mongodb.com/try/download/community) (for database)
- [IPFS](https://ipfs.io/docs/install/) (for decentralized storage)
- [Hardhat](https://hardhat.org/getting-started/) (for blockchain development)

## Project Structure

```
- backend/        # Backend server code (Node.js)
- frontend/       # Frontend application (React.js)
- contract/       # Smart contracts using Hardhat
- README.md/            
```

## Installation

Follow the steps below to install the project dependencies, set up MongoDB, IPFS, and run the local Hardhat testnet.

### 1. Install Dependencies

To install all the dependencies for the backend, frontend, and contract, run the following commands:

```bash
cd backend && yarn install
cd ../frontend && yarn install
cd ../contract && yarn install
```

### 2. Set Up MongoDB


### 3. Set Up IPFS


### 4. Start the Backend Server

Navigate to the `backend` directory and start the server:

```bash
cd backend
node server.js
```

This will start the Node.js backend, which will handle data processing and communicate with MongoDB and IPFS.

### 5. Start the Frontend

Navigate to the `frontend` directory and start the React application:

```bash
cd frontend
yarn start
```

This will start the frontend server, and you should be able to access the app at `http://localhost:3000`.

### 6. Start the Hardhat Local Network

In a new terminal, navigate to the `contract` directory and start the local Hardhat network:

```bash
cd contract
yarn hardhat node
```

This will start the Hardhat testnet locally, allowing you to deploy smart contracts and test interactions with the blockchain.

### 7. Deploy the Contracts

Once the Hardhat network is running, deploy the smart contracts to the local network:

```bash
yarn hardhat run ignition/modules/deploy.js --network localhost
```

This will deploy the EthoSphere smart contracts to the Hardhat local blockchain.

## Environment Variables

The project requires certain environment variables for configuration, including MongoDB connection strings and IPFS settings. These can be added to an `.env` file in the root directory of the `backend`, `frontend`, and `contract` folders.

Example `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/ethosphere
IPFS_API_URL=http://localhost:5001
ETH_NETWORK=localhost
```

Make sure to update the values based on your setup.

## Running Tests

To run tests for the smart contracts, execute the following command in the `contract` directory:

```bash
yarn hardhat test
```

This will run all the test cases written for the EthoSphere contracts, ensuring everything functions as expected.

## Useful Commands

- **Start IPFS Daemon**:
  ```bash
  ipfs daemon
  ```

- **Start MongoDB**:
  ```bash
  mongod --dbpath /path/to/your/mongodb/data
  ```

- **Start Backend**:
  ```bash
  cd backend && node server.js
  ```

- **Start Frontend**:
  ```bash
  cd frontend && yarn start
  ```

- **Start Hardhat Network**:
  ```bash
  cd contract && yarn hardhat node
  ```

- **Deploy Contracts**:
  ```bash
  cd contract && yarn hardhat run ignition/modules/deploy.js --network localhost
  ```

## Conclusion

EthoSphere is now up and running locally! The backend is powered by Node.js with MongoDB for data storage and IPFS for decentralized data handling. The smart contracts are deployed on a local Hardhat network, and the frontend is built using React. Be sure to test and monitor each component to ensure smooth functionality.

Enjoy building with EthoSphere!
