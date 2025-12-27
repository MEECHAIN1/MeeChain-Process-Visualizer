import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_LOGS = [
  {
    contributorId: "0xAbc1234567890123456789012345678901234567",
    action: "minted badge",
    description: "User successfully claimed their 'Genesis' soulbound badge.",
    metadata: {
      badgeType: "Proof of Participation",
      event: "MeeChain Launch"
    },
  },
  {
    contributorId: "0xDef4567890123456789012345678901234567890",
    action: "submitted proposal",
    description: "New governance proposal created for dashboard improvements.",
    metadata: {
      proposalId: "proposal_001",
      notes: "Add a contributor leaderboard to the main dashboard."
    },
  },
];

const SERVICE_ACCOUNT_SNIPPET = `{
  "type": "service_account",
  "project_id": "meechain-prod",
  "private_key_id": "...",
  "client_email": "firebase-adminsdk-...@meechain-prod.iam.gserviceaccount.com",
  ...
}`;

class AuditLogSeedService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSeed() {
    this.log({
        type: LogType.Step,
        title: 'Initializing Firebase Admin SDK...',
        details: 'Using service account credentials for admin privileges.',
        code: SERVICE_ACCOUNT_SNIPPET
    });
    await delay(1200);

    this.log({
        type: LogType.Success,
        title: '✅ Firebase Admin SDK Initialized'
    });
    await delay(500);

    this.log({
        type: LogType.Step,
        title: 'Getting Firestore database instance...'
    });
    await delay(800);

    this.log({
        type: LogType.Success,
        title: '✅ Connected to Firestore'
    });
    await delay(1000);
    
    this.log({
        type: LogType.Info,
        title: 'Preparing seed data for "auditLogs" collection',
        code: JSON.stringify(MOCK_LOGS, null, 2)
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: 'Seeding documents into collection...',
    });
    await delay(1000);

    let docIdCounter = 1;
    for (const log of MOCK_LOGS) {
        const docId = `log_entry_${String(docIdCounter++).padStart(3, '0')}`;
        this.log({
            type: LogType.Step,
            title: `Writing log for ${log.contributorId.slice(0,10)}...`,
            details: [`Action: ${log.action}`, `Document ID: ${docId}`]
        });
        await delay(700);
    }

    this.log({
        type: LogType.Success,
        title: '✅ All audit logs written to database.'
    });
    await delay(1500); 
  }
}

export async function runAuditLogDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Firebase Audit Log Seeding Demo',
    details: 'Simulating a script to populate the audit log with initial records.'
  });
  await delay(1000);

  const seedService = new AuditLogSeedService(log);
  await seedService.runSeed();

  log({
    type: LogType.Complete,
    title: '🎉 Audit Log Seeding Complete!',
    details: [
        '✅ Firestore "auditLogs" collection is now populated.',
        '✅ The system is ready for tracking and auditing contributor actions.',
    ]
  });
}