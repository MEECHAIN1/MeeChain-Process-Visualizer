
import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class WalletBalanceService {
  private log: LogUpdater;
  private address: string;

  constructor(logUpdater: LogUpdater, address: string) {
    this.log = logUpdater;
    this.address = address;
  }
  
  async runSimulation() {
    const bscTestnetRpc = 'https://data-seed-prebsc-1-s1.binance.org:8545';

    this.log({
        type: LogType.Step,
        title: 'Initializing Web3 Provider...',
        details: `Connecting to BSC Testnet via RPC: ${bscTestnetRpc}`,
        code: `const provider = new ethers.providers.JsonRpcProvider("${bscTestnetRpc}");`
    });
    await delay(1500);

    this.log({
        type: LogType.Success,
        title: '✅ Provider connected to BSC Testnet'
    });
    await delay(1000);

    this.log({
        type: LogType.Info,
        title: 'Target Wallet Address',
        details: this.address
    });
    await delay(1000);

    this.log({
        type: LogType.Step,
        title: '1. Fetching Native Currency (BNB) Balance...',
        code: `const bnbBalance = await provider.getBalance("${this.address.slice(0,10)}...");`
    });
    await delay(1500);

    this.log({
        type: LogType.Success,
        title: '✅ Fetched BNB Balance',
        details: [
            'Raw Balance: 1234567890123456789 wei',
            'Formatted Balance: 1.23 BNB'
        ]
    });
    await delay(1500);
    
    this.log({
        type: LogType.Step,
        title: '2. Fetching ERC20 Token Balances (MEE & T2P)...',
        details: 'Creating contract instances and calling the `balanceOf` function.'
    });
    await delay(1500);
    
    this.log({
        type: LogType.Code,
        title: 'Ethers.js Contract Interaction',
        code: `const meeContract = new ethers.Contract(MEE_TOKEN_ADDRESS, ERC20_ABI, provider);
const meeBalance = await meeContract.balanceOf(walletAddress);

const t2pContract = new ethers.Contract(T2P_TOKEN_ADDRESS, ERC20_ABI, provider);
const t2pBalance = await t2pContract.balanceOf(walletAddress);`
    });
    await delay(2500);

    this.log({
        type: LogType.Success,
        title: '✅ Fetched MEE Balance',
        details: [
            'Raw Balance: 5000000000000000000000 wei',
            'Formatted Balance: 5000.00 MEE'
        ]
    });
    await delay(1000);
    
    this.log({
        type: LogType.Success,
        title: '✅ Fetched T2P Balance',
        details: [
            'Raw Balance: 100000000000000000000 wei',
            'Formatted Balance: 100.00 T2P'
        ]
    });
    await delay(1500);

    this.log({
        type: LogType.State,
        title: '📊 Wallet Balance Summary',
        details: [
            'BNB: 1.23',
            'MEE: 5000.00',
            'T2P: 100.00'
        ]
    });
    await delay(1500);
  }
}

export async function runWalletBalanceDemo(logUpdater: LogUpdater, walletAddress?: string | null) {
  const log = logUpdater;
  const addressToUse = walletAddress || "0x883AD20a608e6990ddFF249Ad686b986cD10b4f1";

  log({
    type: LogType.Header,
    title: 'Wallet Balance Checker Demo',
    details: 'Simulating the process of fetching native and ERC20 token balances from the blockchain.'
  });
  await delay(1000);

  const balanceService = new WalletBalanceService(log, addressToUse);
  await balanceService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Balance Check Complete!',
    details: [
        '✅ Successfully fetched and displayed all token balances.',
        '✅ This demonstrates a fundamental read-only interaction with the blockchain.'
    ]
  });
}
