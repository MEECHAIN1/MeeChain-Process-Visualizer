import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ABI_TARGETS = [
  'abi',              // Root abi directory
  'backend/abi',      // Backend service
  'viewer/abis',      // Frontend viewer
  'viewer/src/abis'   // Frontend src
];

const MOCK_ABI = {
  "contractName": "MeeChainSupply",
  "sourceName": "contracts/MeeChainSupply.sol",
  "abi": [
    {
      "inputs": [
        { "internalType": "address", "name": "_meeBot", "type": "address" },
        { "internalType": "address", "name": "_token", "type": "address" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "RefundIssued",
      "type": "event"
    },
    {
      "inputs": [{ "internalType": "address", "name": "userAddress", "type": "address" }],
      "name": "getPendingSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

class AbiSyncService {
  private log: LogUpdater;
  private contractName = 'MeeChainSupply';

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSync() {
    this.log({
        type: LogType.Step,
        title: `Locating source artifact for '${this.contractName}.sol'...`,
        details: `Path: artifacts/contracts/${this.contractName}.sol/${this.contractName}.json`
    });
    await delay(1200);

    this.log({
        type: LogType.Step,
        title: `Extracting ABI from artifact...`
    });
    await delay(800);
    this.log({
        type: LogType.Success,
        title: `✅ ABI Extracted Successfully`,
    });
    
    this.log({
        type: LogType.Code,
        title: 'Extracted ABI Snippet',
        code: JSON.stringify(MOCK_ABI, null, 2)
    });
    await delay(2000);

    this.log({
        type: LogType.Info,
        title: 'Identified ABI Sync Targets',
        details: ABI_TARGETS.map(t => `- ${t}`)
    });
    await delay(1500);

    for (const target of ABI_TARGETS) {
        this.log({
            type: LogType.Step,
            title: `Syncing to '${target}'...`
        });
        await delay(400);
        this.log({
            type: LogType.Success,
            title: `✅ Synced`,
            details: `Copied to: ${target}/${this.contractName}.json`
        });
        await delay(400);
    }
    
    await delay(1000);
  }
}

export async function runAbiSyncDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Auto-Sync ABI Script Demo',
    details: 'Simulating the process of exporting contract ABIs to multiple project directories.'
  });
  await delay(1000);

  const syncService = new AbiSyncService(log);
  await syncService.runSync();

  log({
    type: LogType.Complete,
    title: '🎉 ABI Sync Complete!',
    details: [
        '✅ All target directories are now up-to-date.',
        '✅ Frontend and backend services can now interact with the latest contract version.',
    ]
  });
}