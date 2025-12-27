
import { LogEntryData, LogType, LeaderboardEntry } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x883A...4f1', miningPower: 450, tokensMined: 1250, lastActive: 'Just now' },
  { rank: 2, address: '0x1234...567', miningPower: 380, tokensMined: 980, lastActive: '2m ago' },
  { rank: 3, address: '0xABCD...EFG', miningPower: 310, tokensMined: 820, lastActive: '5m ago' },
  { rank: 4, address: '0x9876...321', miningPower: 290, tokensMined: 750, lastActive: '10m ago' },
  { rank: 5, address: '0x5555...aaa', miningPower: 150, tokensMined: 300, lastActive: '15m ago' },
];

const ONSNAPSHOT_CODE = `
// Real-time listener implementation
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const leaderboardQuery = query(
  collection(db, "mining_stats"),
  orderBy("tokensMined", "desc"),
  limit(10)
);

const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
  const leaderboardData = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  updateUI(leaderboardData); // Reflect live mining activity
});
`;

class LeaderboardService {
  private log: LogUpdater;
  private currentLeaderboard: LeaderboardEntry[];

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
    this.currentLeaderboard = [...INITIAL_LEADERBOARD];
  }

  private generateLeaderboardView(data: LeaderboardEntry[]): string {
    const header = "RANK | ADDRESS      | POWER | TOTAL MINED";
    const divider = "------------------------------------------";
    const rows = data.map(entry => 
      `${entry.rank.toString().padEnd(4)} | ${entry.address.padEnd(12)} | ${entry.miningPower.toString().padEnd(5)} | ${entry.tokensMined.toString().padEnd(10)}`
    ).join('\n');
    return `${header}\n${divider}\n${rows}`;
  }

  async runSimulation() {
    this.log({
      type: LogType.Step,
      title: 'Initializing Firestore real-time listener...',
      details: 'Connecting to "mining_stats" collection with onSnapshot().',
      code: ONSNAPSHOT_CODE
    });
    await delay(1500);

    this.log({
      type: LogType.Success,
      title: '✅ Listener Active: Now receiving live mining updates'
    });
    await delay(1000);

    // Initial snapshot
    this.log({
      type: LogType.State,
      title: '📊 [SNAPSHOT 1] Initial Leaderboard State',
      code: this.generateLeaderboardView(this.currentLeaderboard)
    });
    await delay(2500);

    // Update 1: A user increases their mining power
    this.log({
      type: LogType.Event,
      title: '📡 Live Update Detected: 0x1234...567 mining speed increased!',
      details: 'Firestore trigger: setDoc() updated the miningPower field.'
    });
    await delay(800);
    this.currentLeaderboard[1].miningPower += 150;
    this.currentLeaderboard[1].tokensMined += 300;
    this.currentLeaderboard.sort((a, b) => b.tokensMined - a.tokensMined);
    this.currentLeaderboard.forEach((e, i) => e.rank = i + 1);

    this.log({
      type: LogType.State,
      title: '📊 [SNAPSHOT 2] Leaderboard Updated (Rank Change!)',
      code: this.generateLeaderboardView(this.currentLeaderboard)
    });
    await delay(2500);

    // Update 2: New high-power miner joins
    this.log({
      type: LogType.Event,
      title: '📡 Live Update Detected: New contributor 0xWhale...999 joined the pool!',
      details: 'Firestore trigger: addDoc() detected in collection.'
    });
    await delay(800);
    const whaleEntry: LeaderboardEntry = { 
      rank: 0, 
      address: '0xWhale...999', 
      miningPower: 900, 
      tokensMined: 2000, 
      lastActive: 'Just now' 
    };
    this.currentLeaderboard.push(whaleEntry);
    this.currentLeaderboard.sort((a, b) => b.tokensMined - a.tokensMined);
    this.currentLeaderboard = this.currentLeaderboard.slice(0, 5); // Keep top 5
    this.currentLeaderboard.forEach((e, i) => e.rank = i + 1);

    this.log({
      type: LogType.State,
      title: '📊 [SNAPSHOT 3] Leaderboard Reshuffled',
      code: this.generateLeaderboardView(this.currentLeaderboard)
    });
    await delay(2500);
  }
}

export async function runLeaderboardDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Real-time Leaderboard Synchronization',
    details: 'Simulating live mining activity monitoring via Firestore onSnapshot listeners.'
  });
  await delay(1000);

  const leaderboardService = new LeaderboardService(log);
  await leaderboardService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Leaderboard Demo Complete!',
    details: [
      '✅ Demonstrated real-time synchronization with Firestore.',
      '✅ High-frequency mining updates are efficiently pushed to the UI.',
      '✅ Automatic ranking logic ensures immediate feedback for contributors.'
    ]
  });
}
