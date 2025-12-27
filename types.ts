
export enum LogType {
  Header = 'header',
  Scenario = 'scenario',
  Step = 'step',
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Code = 'code',
  Event = 'event',
  Summary = 'summary',
  State = 'state',
  Complete = 'complete',
}

export interface LogEntryData {
  type: LogType;
  title: string;
  details?: string | string[];
  description?: string;
  code?: string;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  address: string;
  details: { [key: string]: any };
  description?: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  miningPower: number;
  tokensMined: number;
  lastActive: string;
}

export type SyncStatus = 'idle' | 'pending_on_chain' | 'synced';

export interface MiningState {
  points: number;
  level: number;
  lastMined: number;
  isSyncing: boolean;
  syncStatus: SyncStatus;
}
