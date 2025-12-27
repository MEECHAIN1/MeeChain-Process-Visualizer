
import React from 'react';
import { LogEntryData, LogType } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon, DocumentTextIcon, RobotIcon, ChartBarIcon, SignalIcon, TrophyIcon } from './icons';
import CodeBlock from './CodeBlock';

interface LogEntryCardProps {
  entry: LogEntryData;
}

const getIcon = (type: LogType) => {
  const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
  switch (type) {
    case LogType.Header: return <TrophyIcon className={`${iconClass} text-yellow-400`} />;
    case LogType.Scenario: return <DocumentTextIcon className={`${iconClass} text-blue-400`} />;
    case LogType.Step: return <InfoIcon className={`${iconClass} text-gray-400`} />;
    case LogType.Success: return <CheckCircleIcon className={`${iconClass} text-green-400`} />;
    case LogType.Error: return <XCircleIcon className={`${iconClass} text-red-400`} />;
    case LogType.Info: return <InfoIcon className={`${iconClass} text-cyan-400`} />;
    case LogType.Code: return <RobotIcon className={`${iconClass} text-purple-400`} />;
    case LogType.State: return <ChartBarIcon className={`${iconClass} text-indigo-400`} />;
    case LogType.Event: return <SignalIcon className={`${iconClass} text-orange-400`} />;
    case LogType.Complete: return <TrophyIcon className={`${iconClass} text-yellow-300`} />;
    default: return <InfoIcon className={`${iconClass} text-gray-400`} />;
  }
};

const getBorderColor = (type: LogType) => {
  switch (type) {
    case LogType.Header: return "border-yellow-400/50";
    case LogType.Success: return "border-green-400/50";
    case LogType.Error: return "border-red-400/50";
    case LogType.Complete: return "border-yellow-300/50";
    default: return "border-gray-700";
  }
};

const LogEntryCard: React.FC<LogEntryCardProps> = ({ entry }) => {
  return (
    <div className={`log-entry-card bg-gray-800/50 border-l-4 p-4 rounded-r-lg shadow-md flex items-start animate-fade-in ${getBorderColor(entry.type)}`}>
      {getIcon(entry.type)}
      <div className="flex-grow">
        <h3 className="font-bold text-md text-gray-100">{entry.title}</h3>
        {entry.description && (
          <p className="mt-1 text-sm font-medium text-blue-300 italic">Note: {entry.description}</p>
        )}
        {entry.details && (
          <div className="mt-1 text-sm text-gray-400">
            {Array.isArray(entry.details) 
             ? entry.details.map((line, index) => <p key={index}>{line}</p>)
             : <p>{entry.details}</p>
            }
          </div>
        )}
        {entry.code && <CodeBlock code={entry.code} />}
      </div>
       <span className="text-xs text-gray-500 ml-4 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

export default LogEntryCard;
