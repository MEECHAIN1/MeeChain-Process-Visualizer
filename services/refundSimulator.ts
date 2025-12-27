
import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class RefundService {
  private contractAddress: string;
  private meeBotAddress: string;
  private log: LogUpdater;
  private refundIdCounter = 1;

  constructor(contractAddress: string, meeBotAddress: string, logUpdater: LogUpdater) {
    this.contractAddress = contractAddress;
    this.meeBotAddress = meeBotAddress;
    this.log = logUpdater;
  }

  private async logRefundAction(details: {
    userAddress: string;
    txHash: string;
    amount: string;
    status: 'pending' | 'success' | 'failed';
    reason: string;
    description?: string;
  }): Promise<{ refundId: string }> {
    const refundId = `refund-${this.refundIdCounter++}`;
    this.log({
      type: LogType.Step,
      title: 'Logging Refund Action',
      description: details.description,
      details: [
        `Refund ID: ${refundId}`,
        `User: ${details.userAddress}`,
        `Status: ${details.status}`,
        `Reason: ${details.reason}`,
      ],
    });
    await delay(300);
    return { refundId };
  }

  private async updateRefundStatus(refundId: string, status: 'success' | 'failed', refundTxHash?: string) {
    this.log({
      type: status === 'success' ? LogType.Success : LogType.Error,
      title: `Updating Log: Refund ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      details: refundTxHash ? [`Refund Tx: ${refundTxHash}`] : [],
    });
    await delay(300);
  }

  async handleReplayFailure(
    userAddress: string,
    originalTxHash: string,
    amount: string,
    retryAttempts: number,
    customNote?: string
  ): Promise<void> {
    this.log({
      type: LogType.Info,
      title: '🔄 Transaction Replay Failed',
      description: customNote,
      details: [
        `User: ${userAddress.slice(0,10)}...`,
        `Original Tx: ${originalTxHash.slice(0,10)}...`,
        `Amount: ${amount} ETH`,
        `Retry Attempts: ${retryAttempts}`,
        'Initiating automatic refund...',
      ],
    });
    await delay(1000);

    const logEntry = await this.logRefundAction({
      userAddress,
      txHash: originalTxHash,
      amount,
      status: 'pending',
      reason: `Replay failed after ${retryAttempts} attempts`,
      description: customNote
    });

    this.log({
      type: LogType.Success,
      title: `✅ Refund Logged: ${logEntry.refundId}`
    });
    await delay(800);

    try {
      const refundTxHash = await this.executeRefund(userAddress, amount);
      await this.updateRefundStatus(logEntry.refundId, 'success', refundTxHash);
      this.log({
        type: LogType.Success,
        title: '✅ Refund Executed Successfully',
        details: [`Refund Tx: ${refundTxHash}`],
      });
    } catch (error) {
      await this.updateRefundStatus(logEntry.refundId, 'failed');
      this.log({
        type: LogType.Error,
        title: '❌ Refund Execution Failed',
        details: ['Please contact support'],
      });
    }
  }

  private async executeRefund(userAddress: string, amount: string): Promise<string> {
    this.log({
      type: LogType.Step,
      title: 'Executing Refund on-chain (Simulated)',
      details: `Refunding ${amount} ETH to ${userAddress.slice(0,10)}...`
    });
    await delay(1500);
    return '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
  }

  async isReplayConfirmed(userAddress: string): Promise<boolean> {
    await delay(200);
    return false;
  }

  async getPendingSupply(userAddress: string): Promise<string> {
    await delay(200);
    return '0';
  }
}

export async function runDemo(logUpdater: LogUpdater, customNote?: string) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'MeeChain Refund Contract Integration Demo',
    details: 'Smart Contract + Logging Integration',
    description: customNote
  });
  await delay(1000);

  const contractAddress = '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F';
  const meeBotAddress = '0xMeeBotAddress...';
  const refundService = new RefundService(contractAddress, meeBotAddress, log);

  log({
    type: LogType.Scenario,
    title: '📝 Scenario 1: Transaction replay failed multiple times',
  });
  await delay(1000);

  const userAddress = '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1';
  const originalTxHash = '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3';
  const amount = '0.0083595';
  const retryAttempts = 3;

  await refundService.handleReplayFailure(userAddress, originalTxHash, amount, retryAttempts, customNote);
  await delay(1500);

  log({
    type: LogType.State,
    title: '📊 Scenario 2: Contract State Check',
  });
  await delay(1000);
  
  const isConfirmed = await refundService.isReplayConfirmed(userAddress);
  const pendingSupply = await refundService.getPendingSupply(userAddress);
  
  log({
    type: LogType.Info,
    title: `Replay Confirmed: ${isConfirmed ? '✅' : '❌'}`,
  });
  await delay(500);
  log({
    type: LogType.Info,
    title: `Pending Supply: ${pendingSupply}`,
  });
  await delay(1500);

  log({
    type: LogType.Code,
    title: '🤖 Scenario 3: MeeBot Flow Integration',
    details: [
      'Step 1: MeeBot detects transaction',
      'Step 2: Attempts to replay transaction',
      'Step 3: Replay fails after 3 attempts',
      'Step 4: MeeBot triggers automatic refund',
      'Step 5: Refund is logged and executed',
      'Step 6: User is notified',
      'Step 7: Audit trail is created',
    ],
  });
  await delay(1500);
  
  log({
      type: LogType.Code,
      title: '💻 Scenario 4: Integration Code Example',
      code: `
// In your MeeBot service:
async function processTransaction(tx) {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      await replayTransaction(tx);
      return { success: true };
    } catch (error) {
      retries++;
    }
  }

  // Replay failed, trigger refund
  await refundService.handleReplayFailure(
    tx.userAddress,
    tx.hash,
    tx.amount,
    retries
  );
}`
  });
  await delay(1500);

  log({
    type: LogType.Event,
    title: '📡 Scenario 5: Smart Contract Events',
    details: 'The MeeChainSupply.sol contract emits these events, which are monitored and logged by the refund system:',
    code: `
event ReplayConfirmed(address indexed user, uint256 amount)
event SupplyTriggered(address indexed user, uint256 amount)
event RefundIssued(address indexed user, uint256 amount)
`
  });
  await delay(1500);

  log({
    type: LogType.Complete,
    title: '✨ Demo Complete!',
    details: [
      '✅ Integration with MeeChainSupply contract',
      '✅ Automatic refund after replay failures',
      '✅ Complete logging and audit trail',
      '✅ Error handling and recovery',
      '✅ User notification flow',
      '✅ Smart contract event monitoring',
    ],
  });
}
