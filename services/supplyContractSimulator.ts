import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class SupplyContractDeploymentService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async deploy() {
    this.log({
        type: LogType.Info,
        title: '🚀 Deploying MeeChainSupply contract...',
    });
    await delay(1000);
    
    // Simulating env variables from the script
    const MEEBOT_ADDRESS = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'; // A known address for realism
    const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'; // Simulate using default to show warning

    this.log({
        type: LogType.Info,
        title: "⚠️ Warning: Using default token address.",
        details: "Set MEE_TOKEN_ADDRESS env variable for production deployments."
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: '📝 Deploying contract with parameters...',
        details: [
            `MeeBot Address: ${MEEBOT_ADDRESS}`,
            `Token Address: ${TOKEN_ADDRESS}`,
        ]
    });
    await delay(2500); // Simulate deployment transaction time

    const contractAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    this.log({
        type: LogType.Success,
        title: '✅ MeeChainSupply deployed!',
        details: [
            `Contract Address: ${contractAddress}`,
            `MeeBot Address (from contract): ${MEEBOT_ADDRESS}`,
            `Token Address (from contract): ${TOKEN_ADDRESS}`,
        ]
    });
    await delay(1500);

    this.log({
        type: LogType.Code,
        title: '🔧 Next Steps',
        code: `
// 1. Update viewer/config/contracts.ts:
export const MEECHAIN_SUPPLY_ADDRESS = "${contractAddress}";

// 2. Transfer tokens to this contract for supply operations

// 3. Verify contract on BscScan:
npx hardhat verify --network bscTestnet ${contractAddress} "${MEEBOT_ADDRESS}" "${TOKEN_ADDRESS}"
`
    });
    await delay(1500);
  }
}

export async function runSupplyContractDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'MeeChainSupply Contract Deployment Demo',
    details: 'Simulating the deployment of the core supply chain management contract.'
  });
  await delay(1000);

  const deploymentService = new SupplyContractDeploymentService(log);
  await deploymentService.deploy();

  await delay(1000);
  log({
    type: LogType.Complete,
    title: '🎉 Deployment complete!',
    details: [
        '✅ MeeChainSupply contract is now live on the simulated network.',
        '✅ Ready for integration with MeeBot and token transfers.',
    ]
  });
}
