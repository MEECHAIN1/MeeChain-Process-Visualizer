import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_PROPOSALS = [
  {
    title: "อัปเกรดระบบ Smart Contract",
    description: "ข้อเสนอเพื่ออัปเกรดระบบ Smart Contract เพิ่มประสิทธิภาพและความปลอดภัย",
    proposer: "Dev Team",
    status: "Pending",
  },
  {
    title: "จัดสรรงบประมาณ Q4",
    description: "วางแผนงบประมาณสำหรับไตรมาสที่ 4 เพื่อการพัฒนาโปรเจกต์อย่างต่อเนื่อง",
    proposer: "Finance Committee",
    status: "Pending",
  }
];

const FIREBASE_CONFIG_SNIPPET = `{
  "apiKey": "AIzaSy...",
  "authDomain": "meechainmeebot-v1-218162-261fc.firebaseapp.com",
  "projectId": "meechainmeebot-v1-218162-261fc",
  ...
}`;

class FirestoreSeedService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSeed() {
    this.log({
        type: LogType.Step,
        title: 'Initializing Firebase app with config...',
        code: FIREBASE_CONFIG_SNIPPET
    });
    await delay(1200);

    this.log({
        type: LogType.Success,
        title: '✅ Firebase App Initialized'
    });
    await delay(500);

    this.log({
        type: LogType.Step,
        title: 'Connecting to Firestore database...'
    });
    await delay(800);

    this.log({
        type: LogType.Success,
        title: '✅ Connected to Firestore'
    });
    await delay(1000);

    this.log({
        type: LogType.Info,
        title: 'Preparing seed data for "proposals" collection',
        code: JSON.stringify(MOCK_PROPOSALS, null, 2)
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: 'Creating a new write batch...',
        details: 'Batch writes perform multiple operations as a single atomic unit.'
    });
    await delay(1000);

    for (const proposal of MOCK_PROPOSALS) {
        this.log({
            type: LogType.Step,
            title: `Adding proposal "${proposal.title}" to batch...`
        });
        await delay(500);
    }

    this.log({
        type: LogType.Success,
        title: '✅ All documents added to batch.'
    });
    await delay(1000);
    
    this.log({
        type: LogType.Step,
        title: 'Committing batch to Firestore...',
    });
    await delay(1500); // Simulate network latency for the commit
  }
}

export async function runFirestoreSeedDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Firebase Firestore Seeding Demo',
    details: 'Simulating a script to populate the database with initial data.'
  });
  await delay(1000);

  const seedService = new FirestoreSeedService(log);
  await seedService.runSeed();

  log({
    type: LogType.Complete,
    title: '🎉 Seeding Complete!',
    details: [
        '✅ Firestore "proposals" collection has been successfully seeded.',
        '✅ The database is ready for the application to use.',
    ]
  });
}
