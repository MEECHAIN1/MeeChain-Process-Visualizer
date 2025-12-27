import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MintMeeService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    const address = "0x883AD20a608e6990ddFF249Ad686b986cD10b4f1";
    const amount = "1000";

    this.log({
        type: LogType.Scenario,
        title: 'Scenario: Minting MEE tokens for a contributor',
    });
    await delay(1000);

    this.log({
        type: LogType.Step,
        title: 'Calling `mintMEE` function...',
        code: `await mintMEE("${address}", "${amount}");`
    });
    await delay(1500);

    this.log({
        type: LogType.Info,
        title: 'Submitting transaction to the blockchain...',
        details: `Minting ${amount} MEE to address ${address.slice(0, 10)}...`
    });
    await delay(2000);

    const fakeTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    this.log({
        type: LogType.Success,
        title: '✅ Mock transaction successful!',
        details: [`Transaction Hash: ${fakeTxHash}`],
    });
    await delay(1500);
  }
}

export async function runMintMeeDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'MEE Token Minting Demo',
    details: 'Simulating a script to mint MEE utility tokens to a contributor\'s wallet.'
  });
  await delay(1000);

  const mintService = new MintMeeService(log);
  await mintService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Minting Process Complete!',
    details: [
        '✅ 1000 MEE tokens have been minted (simulated).',
        '✅ The contributor can now use these tokens within the MeeChain ecosystem.',
    ]
  });
}