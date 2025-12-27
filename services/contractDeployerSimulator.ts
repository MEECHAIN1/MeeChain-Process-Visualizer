import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function runContractDeployer(
  logUpdater: LogUpdater,
  network: string,
  contractName: string
) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Smart Contract Deployment Initiated',
    details: `Targeting ${network} with ${contractName}.sol`
  });
  await delay(1000);

  log({
    type: LogType.Step,
    title: 'Compiling contracts...',
    code: '> npx hardhat compile'
  });
  await delay(2000);
  log({
    type: LogType.Success,
    title: '✅ Compilation successful.'
  });
  await delay(1000);

  log({
    type: LogType.Step,
    title: `Connecting to network: ${network}...`,
  });
  await delay(1500);
  log({
    type: LogType.Success,
    title: `✅ Connected successfully.`
  });
  await delay(1000);

  const deployerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  log({
    type: LogType.Step,
    title: 'Fetching deployer account...',
    details: `Using address: ${deployerAddress}`
  });
  await delay(1200);

  log({
    type: LogType.Step,
    title: `Deploying ${contractName}.sol...`,
    details: 'Submitting deployment transaction to the network.'
  });
  await delay(3000);

  const txHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
  log({
    type: LogType.Info,
    title: 'Transaction Sent',
    details: [`Tx Hash: ${txHash}`, 'Waiting for block confirmations...']
  });
  await delay(4000);

  const contractAddress = '0x' + Math.random().toString(16).slice(2).padEnd(40, '0');
  log({
    type: LogType.Success,
    title: '✅ Contract Deployed Successfully!',
    details: [
      `Contract Address: ${contractAddress}`,
      `Network: ${network}`
    ]
  });
  await delay(1500);

  log({
    type: LogType.Step,
    title: `Verifying contract on block explorer...`,
  });
  await delay(2500);
  log({
    type: LogType.Success,
    title: '✅ Contract verified successfully!'
  });

  log({
    type: LogType.Complete,
    title: '🎉 Deployment Complete!',
    details: `The ${contractName} contract is now live on the ${network} network.`
  });
}
