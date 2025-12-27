import { LogEntryData, LogType, ActivityLog } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock data based on the provided script
const MOCK_LOGS: ActivityLog[] = [
    {
      id: '5',
      timestamp: new Date('2023-10-27T13:45:00Z').toISOString(),
      action: 'Refund processed for 10 T2P',
      description: 'Automated refund triggered after 3 failed transaction replay attempts.',
      address: '0x1234...5678',
      details: { amount: 10 }
    },
    {
      id: '4',
      timestamp: new Date('2023-10-27T12:00:00Z').toISOString(),
      action: 'Claimed Contributor Badge',
      description: 'Awarded for surpassing 50 successful supply chain verification milestones.',
      address: '0x9876...5432',
      details: { badgeId: 'B002' }
    },
     {
      id: '3',
      timestamp: new Date('2023-10-27T11:20:00Z').toISOString(),
      action: 'MeeBot mood changed to happy',
      description: 'System-wide sentiment shift following positive community engagement metrics.',
      address: 'System',
      details: { mood: 'happy' }
    },
    {
      id: '2',
      timestamp: new Date('2023-10-27T10:05:00Z').toISOString(),
      action: 'Swapped 100 T2P for 50 MEE',
      description: 'Internal utility swap to facilitate governance participation.',
      address: '0xABCD...EFGH',
      details: { amountIn: 100, amountOut: 50 }
    },
    {
      id: '1',
      timestamp: new Date('2023-10-27T10:00:00Z').toISOString(),
      action: 'Claimed Contributor Badge',
      description: 'Genesis badge awarded to early network participants.',
      address: '0x1234...5678',
      details: { badgeId: 'B001' }
    },
];

// Filtering function based on the provided script
function filterLogsByContributor(logs: ActivityLog[], address: string) {
  if (!address) {
    return logs;
  }
  return logs.filter(log => 
    log.address?.toLowerCase().startsWith(address.toLowerCase())
  );
}


class ActivityFeedService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    this.log({
        type: LogType.Step,
        title: 'Fetching recent activity logs from Firestore...',
        code: `await getActivityLogs();`
    });
    await delay(1500);

    this.log({
        type: LogType.Success,
        title: '✅ Successfully fetched activity logs.'
    });
    await delay(1000);

    this.log({
        type: LogType.Code,
        title: '📄 Raw Activity Data (Most Recent First)',
        code: JSON.stringify(MOCK_LOGS, null, 2)
    });
    await delay(2500);

    const contributorAddress = "0x1234...5678";
    this.log({
        type: LogType.Scenario,
        title: `Scenario: User filters for a specific contributor`,
        details: `Filtering for address: ${contributorAddress}`
    });
    await delay(1500);
    
    this.log({
        type: LogType.Step,
        title: 'Applying filter...',
        code: `filterLogsByContributor(logs, "${contributorAddress}");`
    });
    await delay(1500);
    
    const filteredLogs = filterLogsByContributor(MOCK_LOGS, contributorAddress);
    
    this.log({
        type: LogType.Success,
        title: '✅ Filter applied.'
    });
    await delay(1000);
    
    this.log({
        type: LogType.Code,
        title: `📄 Filtered Logs for ${contributorAddress}`,
        code: JSON.stringify(filteredLogs, null, 2)
    });
    await delay(2000);
  }
}

export async function runActivityFeedDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Contributor Activity Feed Demo',
    details: 'Simulating the process of fetching and filtering live activity data from a backend service.'
  });
  await delay(1000);

  const feedService = new ActivityFeedService(log);
  await feedService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Activity Feed Demo Complete!',
    details: [
        '✅ Demonstrated fetching and filtering of real-time data.',
        '✅ This provides transparency and an audit trail for all ecosystem activities.'
    ]
  });
}