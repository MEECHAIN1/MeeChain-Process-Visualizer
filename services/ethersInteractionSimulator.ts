import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class EthersService {
  private log: LogUpdater;
  private balances = { t2p: 1000, mee: 0 };

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async connectWallet() {
    this.log({ type: LogType.Step, title: 'Connecting to wallet (e.g., MetaMask)...' });
    await delay(1200);
    const mockAddress = '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1';
    this.log({ 
        type: LogType.Success, 
        title: '✅ Wallet Connected',
        details: [`Address: ${mockAddress}`]
    });
    return mockAddress;
  }

  async getBalances() {
    this.log({ type: LogType.Step, title: 'Fetching token balances...' });
    await delay(1000);
    this.log({ 
        type: LogType.Info, 
        title: 'Current Balances',
        details: [
            `T2P: ${this.balances.t2p.toFixed(2)}`,
            `MEE: ${this.balances.mee.toFixed(2)}`,
        ]
    });
  }

  async swapT2P(amount: number) {
    const exchangeRate = 10;
    const meeAmount = amount / exchangeRate;

    this.log({
        type: LogType.Step,
        title: `1. Approving T2P spend for swap...`,
        details: `Requesting permission for the MEE contract to spend ${amount} T2P.`,
        code: `const approveTx = await t2pContract.approve(MEE_ADDRESS, ${amount});\nawait approveTx.wait();`
    });
    await delay(2000);
    
    const approveTxHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
    this.log({
        type: LogType.Success,
        title: '✅ Approval Transaction Sent',
        details: [`Tx Hash: ${approveTxHash.slice(0, 20)}...`]
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: `2. Executing swap...`,
        details: `Minting ${meeAmount} MEE by spending ${amount} T2P.`,
        code: `const mintTx = await meeContract.mint(userAddress, ${meeAmount});\nawait mintTx.wait();`
    });
    await delay(2500);

    const mintTxHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
    this.log({
        type: LogType.Success,
        title: '✅ Swap Transaction Successful',
        details: [`Tx Hash: ${mintTxHash.slice(0, 20)}...`]
    });
    
    // Update balances
    this.balances.t2p -= amount;
    this.balances.mee += meeAmount;
    await delay(1000);
  }

  async logToFirestore() {
      this.log({
          type: LogType.Step,
          title: 'Logging swap to Firestore...',
          details: 'For off-chain analytics and record-keeping.'
      });
      await delay(1200);
      this.log({
          type: LogType.Success,
          title: '✅ Logged successfully to "supplyLogs" collection.'
      });
  }

}

export async function runEthersDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Ethers.js Token Swap Demo',
    details: 'Simulating a T2P to MEE token swap using ethers.js.'
  });
  await delay(1000);

  const ethersService = new EthersService(log);
  
  await ethersService.connectWallet();
  await delay(1000);

  await ethersService.getBalances(); // Initial balances
  await delay(1500);

  log({
      type: LogType.Scenario,
      title: 'Scenario: User swaps 100 T2P for MEE',
      details: 'Exchange Rate: 10 T2P = 1 MEE'
  });
  await delay(1500);

  await ethersService.swapT2P(100);
  await delay(1500);
  
  await ethersService.getBalances(); // Final balances
  await delay(1500);

  await ethersService.logToFirestore();
  await delay(1500);

  log({
    type: LogType.Complete,
    title: '🎉 Token Swap Complete!',
    details: [
        '✅ User has successfully exchanged 100 T2P for 10 MEE tokens.',
        '✅ The two-step process (approve and transfer) was completed.',
        '✅ The transaction was logged for off-chain auditing.'
    ]
  });
}