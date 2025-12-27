import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ENV_LOCAL_CONTENT = `NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="meechainmeebot-v1-218162-261fc.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="meechainmeebot-v1-218162-261fc"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="meechainmeebot-v1-218162-261fc.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="412472571465"
NEXT_PUBLIC_FIREBASE_APP_ID="1:412472571465:web:145cee31cd68b9811ff198"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-FY1ZDBVR5X"
`;

class BackendSetupService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSetup() {
    this.log({
        type: LogType.Step,
        title: 'Checking for backend environment file...',
        details: 'Path: .env.local'
    });
    await delay(1200);

    this.log({
        type: LogType.Success,
        title: '✅ .env.local file found and loaded.',
    });
    await delay(1000);

    this.log({
        type: LogType.Code,
        title: '📄 Loaded Environment Variables',
        code: ENV_LOCAL_CONTENT
    });
    await delay(2500);
    
    this.log({
        type: LogType.Info,
        title: 'Variable Explanations',
        details: [
            'These NEXT_PUBLIC_ variables provide the frontend application with the necessary credentials to connect to your Firebase project.',
            'They enable services like Authentication, Firestore, Storage, and Analytics.',
        ]
    });
    await delay(2000);
    
    this.log({
        type: LogType.Success,
        title: '✅ Firebase configuration is ready.',
        details: 'The application can now initialize a connection to Firebase.'
    });
    await delay(1000);
  }
}

export async function runBackendSetupDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Backend Firebase Setup Demo',
    details: 'Simulating the process of loading Firebase credentials for the main application.'
  });
  await delay(1000);

  const setupService = new BackendSetupService(log);
  await setupService.runSetup();

  log({
    type: LogType.Complete,
    title: '🎉 Backend Setup Complete!',
    details: [
        '✅ Environment variables are loaded (simulated).',
        '✅ The application is ready to connect to Firebase services.',
    ]
  });
}
