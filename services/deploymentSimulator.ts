import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class DeploymentService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async deploy() {
    this.log({
        type: LogType.Info,
        title: '🚀 Deploying MeeChainBadge contract...',
    });
    await delay(1000);
    
    const deployer = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const balance = '10000000000000000000000'; // 10000 ETH
    
    this.log({
        type: LogType.Step,
        title: 'Deployment Account',
        details: [
            `Address: ${deployer}`,
            `Balance: ${balance} wei (10000 ETH)`,
        ]
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: '📝 Deploying MeeChainBadge...',
    });
    await delay(2500); // Simulate deployment time

    const badgeAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    this.log({
        type: LogType.Success,
        title: '✅ MeeChainBadge deployed!',
        details: [
            `Contract Address: ${badgeAddress}`,
            `Issuer: ${deployer}`,
            `Owner: ${deployer}`,
        ]
    });
    await delay(1000);

    const deploymentInfo = {
        network: 'sepolia',
        contractAddress: badgeAddress,
        deployer: deployer,
        issuer: deployer,
        owner: deployer,
        timestamp: new Date().toISOString(),
      };
      
    this.log({
        type: LogType.Code,
        title: '📄 Deployment Info',
        code: JSON.stringify(deploymentInfo, null, 2)
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: '⏳ Waiting for 6 block confirmations...',
    });
    await delay(3000);

    this.log({
        type: LogType.Step,
        title: '🔍 Verifying contract on Etherscan...',
    });
    await delay(2000);
    this.log({
        type: LogType.Success,
        title: '✅ Contract verified successfully!',
    });
    await delay(1500);
  }
}

export async function runDeploymentDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'MeeChainBadge Deployment Demo',
    details: 'Simulating the deployment of a Soulbound Badge NFT contract.'
  });
  await delay(1000);

  const deploymentService = new DeploymentService(log);
  await deploymentService.deploy();

  await delay(1000);
  log({
    type: LogType.Complete,
    title: '🎉 Deployment complete!',
    details: [
        'Next steps:',
        '1. Update BADGE_CONTRACT_ADDRESS in src/services/badgeMintingService.ts',
        '2. Test badge minting with: npm run demo:badge-system',
        '3. Update deploy-registry.json with new contract address'
    ]
  });
}
