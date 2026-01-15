
import { LogEntryData, LogType, MiningState, SyncStatus } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const SMART_CONTRACT_CODE = `
MeeChainMining.sol
Ensuring on-chain persistence for cross-chain verifiability
function recordMining(address user, uint256 amount) external onlyMeeBot {
    userStats[user].points += amount;
    userStats[user].lastMined = block.timestamp;
    emit MiningRecorded(user, amount, block.timestamp);
}
`;

const CLOUD_FUNCTION_CODE = `
// mine.ts - Firebase Cloud Function (The Orchestrator)
export const mine = onCall(async (request) => {
  const { auth } = request;
  const userRef = db.collection('users').doc(auth.uid);
  
  // 1. Write to Firestore first (Source of Truth for Frontend)
  // This triggers the real-time listener instantly for the user.
  await db.runTransaction(async (tx) => {
    const userDoc = await tx.get(userRef);
    const newPoints = (userDoc.data().points || 0) + 25;
    
    tx.update(userRef, { 
      points: newPoints, 
      lastMined: Date.now(),
      syncStatus: 'pending_on_chain' 
    });
  });

  // 2. Sync to Smart Contract (On-chain Security)
  // This can happen asynchronously but is managed here for consistency.
  try {
    const txResponse = await miningContract.recordMining(auth.uid, 25);
    await txResponse.wait(); // Wait for MeeChain block confirmation
    
    // 3. Update Firestore to 'synced' status
    await userRef.update({ syncStatus: 'synced' });
  } catch (e) {
    // Retry logic would go here
    await userRef.update({ syncStatus: 'retry_pending' });
  }
});
`;

export async function runMiningSyncDemo(
  logUpdater: LogUpdater, 
  processEvent: (p: number, s: SyncStatus) => void
) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Atomic Mining Synchronization Protocol',
    details: 'Demonstrating the secure bridge between Web2 (Firestore) and Web3 (MeeChain).'
  });
  await delay(1000);

  log({
    type: LogType.Step,
    title: 'Phase 1: Transaction Initiation',
    details: 'Frontend sends auth token and request to Firebase Cloud Functions.',
    code: 'const response = await functions.httpsCallable("mine")();'
  });
  await delay(1500);

  log({
    type: LogType.Info,
    title: 'Phase 2: Cloud Function Orchestration',
    details: 'Executing transaction to ensure data integrity across layers.',
    code: CLOUD_FUNCTION_CODE
  });
  await delay(2000);

  log({
    type: LogType.Success,
    title: '✅ Step A: Firestore Document Updated',
    details: 'Write operation successful. points: +25 | status: pending_on_chain'
  });
  await delay(800);

  log({
    type: LogType.Event,
    title: '📡 Step B: Frontend Reacts via onSnapshot',
    details: 'MeeBotContext receives the Firestore delta and updates local state instantly.',
  });
  
  // Instant UI feedback simulation
  processEvent(25, 'pending_on_chain');
  
  await delay(2000);

  log({
    type: LogType.Step,
    title: 'Phase 3: Blockchain Settlement',
    details: 'MeeBot-Admin relay node signs and broadcasts the mining payload to MeeChain.',
    code: SMART_CONTRACT_CODE
  });
  await delay(2500);

  log({
    type: LogType.Success,
    title: '✅ Step C: On-Chain Block Confirmed',
    details: 'Transaction 0xmeechain... confirmed. Emitting MiningRecorded event.'
  });
  await delay(1200);

  log({
    type: LogType.Success,
    title: '✅ Step D: Final Status Sync',
    details: 'Cloud Function updates Firestore syncStatus to "synced".'
  });

  // Final UI state update
  processEvent(0, 'synced');

  await delay(1000);

  log({
    type: LogType.State,
    title: 'Consensus Verification State',
    details: [
      '• Firestore (Real-time): Points = +25 (MATCH)',
      '• MeeChain (On-Chain): Points = +25 (MATCH)',
      '• Frontend (Context): Points = +25 (MATCH)',
    ]
  });

  log({
    type: LogType.Complete,
    title: '🎉 Full Ecosystem Sync Verified!',
    details: [
      '✅ 100% Data consistency between DB and Blockchain.',
      '✅ Near-zero latency for user feedback via Firestore.',
      '✅ Immutable proof of mining stored on MeeChain.',
    ]
  });
}
