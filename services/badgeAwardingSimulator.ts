import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class BadgeAwardingService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    const userAddress = "0x883AD20a608e6990ddFF249Ad686b986cD10b4f1";
    const badgeType = "SUPPLY_SUCCESS";
    const supplyTxHash = "0x28abc8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c98ff04";

    this.log({
        type: LogType.Scenario,
        title: `Scenario: Awarding a badge for a successful supply transaction`,
    });
    await delay(1200);

    this.log({
        type: LogType.Step,
        title: 'On-Chain Event Confirmed',
        details: [
            `MeeChainSupplyService detected a successful 'triggerSupply' transaction.`,
            `User: ${userAddress.slice(0, 10)}...`,
            `Transaction Hash: ${supplyTxHash.slice(0, 15)}...`
        ]
    });
    await delay(1500);

    this.log({
        type: LogType.Info,
        title: 'Invoking Badge Service...',
        details: 'The backend service now calls the internal BadgeService to handle the award.',
        code: `await badgeService.awardBadge("${userAddress.slice(0,10)}...", "${badgeType}");`
    });
    await delay(2000);

    this.log({
        type: LogType.Step,
        title: `Checking if user already has '${badgeType}' badge...`
    });
    await delay(1000);
    
    this.log({
        type: LogType.Success,
        title: `✅ User does not own this badge. Proceeding to mint.`
    });
    await delay(1000);
    
    this.log({
        type: LogType.Step,
        title: `Minting '${badgeType}' badge...`,
        details: `Submitting a transaction to the MeeChainBadge contract.`
    });
    await delay(2000);

    const mintTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    this.log({
        type: LogType.Success,
        title: '✅ Badge Minted Successfully!',
        details: [`Mint Transaction Hash: ${mintTxHash}`],
    });
    await delay(1500);
  }
}

export async function runBadgeAwardingDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Automated Contributor Badge Awarding',
    details: 'Simulating the backend process for awarding a soulbound token (SBT) badge after an on-chain event.'
  });
  await delay(1000);

  const awardService = new BadgeAwardingService(log);
  await awardService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Badge Awarding Process Complete!',
    details: [
        `✅ The contributor has been awarded the "${'SUPPLY_SUCCESS'}" badge.`,
        '✅ This provides immediate, on-chain recognition for their contribution.',
        '✅ The automated system ensures rewards are timely and verifiable.'
    ]
  });
}