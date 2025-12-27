import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ENV_EXAMPLE_CONTENT = `# The URL of your Firebase Function that returns the milestone data
VITE_FUNCTION_URL="https://your-cloud-function-url.com/triggerBadgeMint"

# (Optional) The authentication token for your Firebase Function
VITE_VIEWER_TOKEN="your-secret-viewer-token"
`;

const ENV_FILLED_CONTENT = `VITE_FUNCTION_URL="https://us-central1-meechain-prod.cloudfunctions.net/triggerBadgeMint"
VITE_VIEWER_TOKEN="b3KSt9Z...4XyG7p"
`;

class ViewerSetupService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSetup() {
    this.log({
        type: LogType.Step,
        title: 'Checking for viewer environment file...',
        details: 'Path: viewer/.env'
    });
    await delay(1200);

    this.log({
        type: LogType.Error,
        title: '❌ .env file not found.',
        details: 'The viewer requires this file to connect to backend services.'
    });
    await delay(1000);

    this.log({
        type: LogType.Info,
        title: 'Reading from template file...',
        details: 'Using viewer/.env.example as a reference.'
    });
    await delay(800);

    this.log({
        type: LogType.Code,
        title: '📄 .env.example content',
        code: ENV_EXAMPLE_CONTENT
    });
    await delay(2000);

    this.log({
        type: LogType.Step,
        title: 'Instructions',
        details: [
            '1. Create a new file named `.env` in the `viewer/` directory.',
            '2. Copy the content from `.env.example` into the new `.env` file.',
            '3. Replace the placeholder values with your actual configuration.'
        ]
    });
    await delay(2000);

     this.log({
        type: LogType.Code,
        title: 'Example .env file',
        code: ENV_FILLED_CONTENT
    });
    await delay(1500);

    this.log({
        type: LogType.Info,
        title: 'Variable Explanations',
        details: [
            'VITE_FUNCTION_URL: The secure endpoint of your Firebase Cloud Function responsible for badge minting.',
            'VITE_VIEWER_TOKEN: An optional, secret token for authenticating requests between the viewer and the function.',
        ]
    });
    await delay(2000);

    this.log({
        type: LogType.Success,
        title: '✅ Simulating .env file creation...',
    });
    await delay(1000);
  }
}

export async function runViewerSetupDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Viewer Environment Setup Demo',
    details: 'Simulating the process of configuring the viewer application.'
  });
  await delay(1000);

  const setupService = new ViewerSetupService(log);
  await setupService.runSetup();

  log({
    type: LogType.Complete,
    title: '🎉 Viewer Setup Complete!',
    details: [
        '✅ Environment variables are now configured (simulated).',
        '✅ The viewer application is ready to connect to the Firebase backend.',
    ]
  });
}