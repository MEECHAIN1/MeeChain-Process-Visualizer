import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const HARDHAT_CONFIG_CONTENT = `require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 } // Optimizes gas costs
    }
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000, // 5 gwei
    }
  },
  etherscan: {
    apiKey: { bsc: process.env.BSCSCAN_API_KEY || "" }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};`;

class HardhatConfigService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    this.log({
        type: LogType.Step,
        title: 'Loading Hardhat configuration...',
        details: 'Path: hardhat.config.js'
    });
    await delay(1200);

    this.log({
        type: LogType.Code,
        title: '📄 hardhat.config.js content',
        code: HARDHAT_CONFIG_CONTENT
    });
    await delay(2500);

    this.log({
        type: LogType.Info,
        title: 'Configuration Sections',
        details: [
            'solidity: Specifies compiler version (0.8.20) and optimizer settings for gas efficiency.',
            'networks: Defines connection details for blockchains like BSC Testnet and Mainnet.',
            'etherscan: Holds the API key for automated contract verification on BscScan.',
            'paths: Customizes directory locations for contracts, tests, and build artifacts.',
            'dotenv: Loads private keys and API keys securely from a .env file.',
        ]
    });
    await delay(2000);

    this.log({
        type: LogType.Step,
        title: 'Simulating Hardhat command: compile',
        code: `> npx hardhat compile`
    });
    await delay(1500);
    this.log({
        type: LogType.Success,
        title: '✅ Compilation successful',
        details: `Generated artifacts in ./artifacts/ directory, as defined in 'paths'.`
    });
    await delay(1000);
    
    this.log({
        type: LogType.Step,
        title: 'Simulating Hardhat command: test',
        code: '> npx hardhat test'
    });
    await delay(1000);
    this.log({
        type: LogType.Info,
        title: 'Running tests...',
        details: `Looking for test files in ./test/ directory, as defined in 'paths'.`
    });
    await delay(1500);
    this.log({
        type: LogType.Success,
        title: '✅ 3 tests passed',
    });
    await delay(1000);


    this.log({
        type: LogType.Step,
        title: 'Simulating deployment to BSC Testnet...',
        code: '> npx hardhat run scripts/deploy.js --network bscTestnet'
    });
    await delay(1000);

    this.log({
        type: LogType.Info,
        title: 'Using "bscTestnet" network configuration:',
        details: [
            `URL: https://data-seed-prebsc-1-s1.binance.org:8545/`,
            `Chain ID: 97`,
            `Gas Price: 10 gwei`,
            `Account: Loaded from process.env.PRIVATE_KEY`
        ]
    });
    await delay(2000);

    const contractAddress = '0x' + Math.random().toString(16).slice(2).padEnd(40, '0');
    this.log({
        type: LogType.Success,
        title: '✅ Deployment to Testnet successful (Simulated)',
        details: `Contract deployed to: ${contractAddress}`
    });
    await delay(1500);
    
    this.log({
        type: LogType.Step,
        title: 'Simulating deployment to BSC Mainnet...',
        code: '> npx hardhat run scripts/deploy.js --network bscMainnet'
    });
    await delay(1000);
     this.log({
        type: LogType.Info,
        title: 'Using "bscMainnet" network configuration:',
        details: [
            `URL: https://bsc-dataseed.binance.org/`,
            `Chain ID: 56`,
            `Gas Price: 5 gwei`,
            `Account: Loaded from process.env.PRIVATE_KEY`
        ]
    });
    await delay(2000);
     this.log({
        type: LogType.Success,
        title: '✅ Mainnet deployment ready (Simulated)',
        details: `This would deploy the contract to the live BNB Smart Chain.`
    });
    await delay(1500);
  }
}

export async function runHardhatConfigDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Hardhat Configuration Demo',
    details: 'Simulating the loading and usage of the hardhat.config.js file for contract deployment.'
  });
  await delay(1000);

  const configService = new HardhatConfigService(log);
  await configService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Hardhat Configuration Verified!',
    details: [
        '✅ The Hardhat environment is correctly configured.',
        '✅ Ready for compiling, testing, and deploying smart contracts.',
    ]
  });
}
