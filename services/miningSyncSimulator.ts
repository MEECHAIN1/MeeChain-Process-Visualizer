
import { LogEntryData, LogType, MiningState } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const CLOUD_FUNCTION_CODE = `
// mine.ts - Firebase Cloud Function
export const mine = onCall(async (request) => {
  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);
  
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    const data = doc.data();
    
    const newPoints = (data.points || 0) + 10;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    transaction.update(userRef, {
      points: newPoints,
      level: newLevel,
      lastMined: Date.now()
    });
    
    return { points: newPoints, level: newLevel };
  });
});
`;

const FIREBASE_LISTENER_CODE = `
// Frontend - Real-time Sync
useEffect(() => {
  if (!user) return;
  
  const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      // Sync local state with Firestore
      setMiningState({
        points: data.points,
        level: data.level,
        lastMined: data.lastMined
      });
    }
  });
  
  return () => unsubscribe();
}, [user]);
`;

export async function runMiningSyncDemo(
  logUpdater: LogUpdater, 
  updateState: (s: Partial<MiningState>) => void
) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Mining State Synchronization Flow',
    details: 'Demonstrating real-time state updates across Firestore, Functions, and React Context.'
  });
  await delay(1000);

  log({
    type: LogType.Scenario,
    title: 'User initiates "Mine" action',
    details: 'The frontend calls the secure "mine" Firebase Function.'
  });
  await delay(1200);

  log({
    type: LogType.Step,
    title: '1. Invoking Cloud Function...',
    code: 'const result = await httpsCallable(functions, "mine")();'
  });
  await delay(1500);

  log({
    type: LogType.Code,
    title: '2. Backend logic processing (Transaction)',
    details: 'Atomic update ensuring points and levels are synced.',
    code: CLOUD_FUNCTION_CODE
  });
  await delay(2500);

  log({
    type: LogType.Success,
    title: '✅ Transaction Committed to Firestore',
    details: 'User document updated: points += 10'
  });
  await delay(1000);

  log({
    type: LogType.Event,
    title: '📡 Firestore onSnapshot triggered!',
    details: 'The real-time listener detects the document change.',
    code: FIREBASE_LISTENER_CODE
  });
  await delay(1500);

  log({
    type: LogType.Step,
    title: '3. Updating Frontend MeeBotContext...',
    details: 'Dispatching state update to reflect new points and levels UI-wide.'
  });
  
  // Simulate the actual state update
  updateState({
    points: 10,
    level: 1,
    lastMined: Date.now(),
  });
  
  await delay(1000);
  log({
    type: LogType.Success,
    title: '✅ Global State Synchronized',
    details: 'Points: 10 | Level: 1 | UI updated real-time'
  });
  await delay(1500);

  log({
    type: LogType.Info,
    title: '🔄 Continuous Sync Verification',
    details: 'Performing a second mining cycle to demonstrate level progression.'
  });
  await delay(1000);

  log({
    type: LogType.Step,
    title: 'Mining cycle #2 starting...'
  });
  await delay(1000);

  updateState({
    points: 105,
    level: 2, // Level up logic triggered
    lastMined: Date.now()
  });

  log({
    type: LogType.Complete,
    title: '🎉 Synchronization Successful!',
    details: [
      '✅ Multi-layer sync complete.',
      '✅ Firestore acts as the source of truth.',
      '✅ React Context handles real-time UI propagation.',
      '✅ Points and Levels are persistent and verified.'
    ]
  });
}
