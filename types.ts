
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
  code?: string;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  address: string;
  details: { [key: string]: any };
}
