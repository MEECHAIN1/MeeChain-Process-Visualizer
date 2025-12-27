
import React, { useState, useCallback } from 'react';
import { runContractDeployer } from '../services/contractDeployerSimulator';
import { LogEntryData, LogType } from '../types';
import { CloudUploadIcon, RocketIcon } from './icons';

interface SmartContractDeployerProps {
  addLogEntry: (entry: Omit<LogEntryData, 'timestamp'>) => void;
  setLogEntries: React.Dispatch<React.SetStateAction<LogEntryData[]>>;
}

const SmartContractDeployer: React.FC<SmartContractDeployerProps> = ({ addLogEntry, setLogEntries }) => {
  const [network, setNetwork] = useState('bscTestnet');
  const [contract, setContract] = useState('MeeChainSupply');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = useCallback(async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setLogEntries([]); // Clear previous logs
    try {
      await runContractDeployer(addLogEntry, network, contract);
    } catch (error) {
      console.error("Deployment failed:", error);
      // Fix: Use LogType.Error instead of 'error' string literal to match the LogType enum
       addLogEntry({
        type: LogType.Error,
        title: 'An unexpected error occurred during deployment simulation.',
      });
    } finally {
      setIsDeploying(false);
    }
  }, [isDeploying, network, contract, addLogEntry, setLogEntries]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center">
            <RocketIcon className="w-7 h-7 mr-3" />
            Smart Contract Deployer
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="network-select" className="block text-sm font-medium text-gray-300 mb-2">
            Target Network
          </label>
          <select
            id="network-select"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            disabled={isDeploying}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="bscTestnet">Binance Smart Chain (Testnet)</option>
            <option value="bscMainnet">Binance Smart Chain (Mainnet)</option>
            <option value="sepolia">Sepolia (Ethereum Testnet)</option>
            <option value="local">Local Hardhat Node</option>
          </select>
        </div>
        <div>
          <label htmlFor="contract-select" className="block text-sm font-medium text-gray-300 mb-2">
            Contract to Deploy
          </label>
          <select
            id="contract-select"
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            disabled={isDeploying}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="MeeChainSupply">MeeChainSupply.sol</option>
            <option value="MeeChainBadge">MeeChainBadge.sol</option>
            <option value="MeeToken">MeeToken.sol</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
        >
          <CloudUploadIcon className="w-6 h-6 mr-3"/>
          {isDeploying ? 'Deployment in Progress...' : `Deploy to ${network}`}
        </button>
      </div>
       <p className="text-xs text-gray-500 mt-4 text-center">
        This is a simulated deployment. No real assets will be used.
       </p>
    </div>
  );
};

export default SmartContractDeployer;
