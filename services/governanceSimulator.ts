import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_PROPOSALS = [
  {
    id: 'prop-001',
    title: "อัปเกรดระบบ Smart Contract",
    description: "ข้อเสนอเพื่ออัปเกรดระบบ Smart Contract เพิ่มประสิทธิภาพและความปลอดภัย",
    proposer: "0xDevTeam...",
    status: "Voting Open",
    votesFor: 1250,
    votesAgainst: 150,
  },
  {
    id: 'prop-002',
    title: "จัดสรรงบประมาณ Q4",
    description: "วางแผนงบประมาณสำหรับไตรมาสที่ 4 เพื่อการพัฒนาโปรเจกต์อย่างต่อเนื่อง",
    proposer: "0xFinance...",
    status: "Voting Open",
    votesFor: 800,
    votesAgainst: 450,
  }
];

class GovernanceService {
  private log: LogUpdater;
  private proposals = JSON.parse(JSON.stringify(MOCK_PROPOSALS)); // Deep copy

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    this.log({
        type: LogType.Step,
        title: 'Fetching active proposals from Firestore...',
    });
    await delay(1200);

    this.log({
        type: LogType.Success,
        title: '✅ Fetched 2 active proposals.'
    });
    await delay(1000);

    this.log({
        type: LogType.Code,
        title: '📄 Active Governance Proposals',
        code: JSON.stringify(this.proposals, null, 2)
    });
    await delay(2500);
    
    const userAddress = "0x883AD20a608e6990ddFF249Ad686b986cD10b4f1";
    const votingPower = 500;
    this.log({
        type: LogType.Step,
        title: "Connecting user's wallet...",
    });
    await delay(1000);
    this.log({
        type: LogType.Success,
        title: "✅ Wallet Connected",
        details: [
            `Address: ${userAddress}`,
            `Voting Power: ${votingPower} MEE`
        ]
    });
    await delay(1500);
    
    this.log({
        type: LogType.Scenario,
        title: `Scenario: User votes 'For' on Proposal #1`,
        details: `Casting ${votingPower} votes for "อัปเกรดระบบ Smart Contract"`
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: 'Preparing vote transaction...',
        code: `await governanceContract.castVote("prop-001", VOTE_TYPE_FOR);`
    });
    await delay(1500);

    this.log({
        type: LogType.Info,
        title: 'Submitting vote to the blockchain...',
        details: 'Waiting for transaction confirmation.'
    });
    await delay(2000);

    const voteTxHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
    this.log({
        type: LogType.Success,
        title: '✅ Vote transaction successful!',
        details: [`Tx Hash: ${voteTxHash.slice(0, 20)}...`]
    });
    await delay(1000);

    // Update the proposal state
    const votedProposal = this.proposals.find(p => p.id === 'prop-001');
    if (votedProposal) {
        votedProposal.votesFor += votingPower;
    }

    this.log({
        type: LogType.Step,
        title: 'Fetching updated proposal state...'
    });
    await delay(1000);

    this.log({
        type: LogType.State,
        title: '📊 Updated Proposal State (prop-001)',
        code: JSON.stringify(votedProposal, null, 2)
    });
    await delay(2000);
  }
}

export async function runGovernanceDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Governance Voting Demo',
    details: 'Simulating the process of a contributor voting on a community proposal.'
  });
  await delay(1000);

  const governanceService = new GovernanceService(log);
  await governanceService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Voting Process Complete!',
    details: [
        '✅ The user successfully cast their vote on-chain.',
        '✅ The proposal\'s vote count has been updated.',
        '✅ This demonstrates the core of decentralized decision-making in a DAO.',
    ]
  });
}