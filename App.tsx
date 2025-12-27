import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LogEntryData, LogType } from './types';
import LogEntryCard from './components/LogEntryCard';
import DemoCategory from './components/DemoCategory';
import SmartContractDeployer from './components/SmartContractDeployer';
import { runDemo as runRefundDemo } from './services/refundSimulator';
import { runDeploymentDemo } from './services/deploymentSimulator';
import { runSupplyContractDemo } from './services/supplyContractSimulator';
import { runAbiSyncDemo } from './services/abiSyncSimulator';
import { runFirestoreSeedDemo } from './services/firestoreSeedSimulator';
import { runAuditLogDemo } from './services/auditLogSimulator';
import { runValidationDemo } from './services/validationSimulator';
import { runViewerSetupDemo } from './services/viewerSetupSimulator';
import { runBackendSetupDemo } from './services/backendSetupSimulator';
import { runHardhatConfigDemo } from './services/hardhatConfigSimulator';
import { runTypescriptConfigDemo } from './services/typescriptConfigSimulator';
import { runMintMeeDemo } from './services/mintMeeSimulator';
import { runEthersDemo } from './services/ethersInteractionSimulator';
import { runBadgeAwardingDemo } from './services/badgeAwardingSimulator';
import { runWeb3AuthDemo } from './services/web3AuthSimulator';
import { runWalletBalanceDemo } from './services/walletBalanceSimulator';
import { runActivityFeedDemo } from './services/activityFeedSimulator';
import { runGovernanceDemo } from './services/governanceSimulator';
import { PlayIcon, RefreshIcon, RocketIcon, CubeIcon, FileSyncIcon, DatabaseIcon, ClipboardListIcon, ShieldCheckIcon, CogIcon, ServerIcon, WrenchScrewdriverIcon, TypeScriptIcon, CoinStackIcon, CurrencySwapIcon, AwardIcon, UserCircleIcon, WalletIcon, ViewListIcon, ScaleIcon, UsersIcon, LogoutIcon, CloudUploadIcon } from './components/icons';

type DemoType = 'none' | 'refund' | 'deployment' | 'supply' | 'abi' | 'firestore' | 'audit' | 'validation' | 'viewer' | 'backend' | 'hardhat' | 'typescript' | 'mint' | 'ethers' | 'badge' | 'web3auth' | 'wallet' | 'activity' | 'governance';

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntryData[]>([]);
  const [demoRunning, setDemoRunning] = useState<DemoType>('none');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDeployer, setShowDeployer] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logEntries]);

  const addLogEntry = useCallback((entry: Omit<LogEntryData, 'timestamp'>) => {
    const newEntry: LogEntryData = { ...entry, timestamp: Date.now() };
    setLogEntries(prev => [...prev, newEntry]);
  }, []);

  const handleConnectWallet = useCallback(() => {
    if (walletAddress) return;
    const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setWalletAddress(mockAddress);
    addLogEntry({
        type: LogType.Success,
        title: 'Wallet Connected (Simulated)',
        details: [`Address: ${mockAddress}`]
    });
  }, [walletAddress, addLogEntry]);

  const handleDisconnectWallet = useCallback(() => {
    if (!walletAddress) return;
    addLogEntry({
        type: LogType.Info,
        title: 'Wallet Disconnected',
        details: [`Address: ${walletAddress}`]
    });
    setWalletAddress(null);
  }, [walletAddress, addLogEntry]);

  const handleStartDemo = useCallback(async (demoType: DemoType) => {
    if (demoRunning !== 'none') return;
    
    setDemoRunning(demoType);
    setLogEntries([]);
    try {
      const demos = {
        'refund': runRefundDemo,
        'deployment': runDeploymentDemo,
        'supply': runSupplyContractDemo,
        'abi': runAbiSyncDemo,
        'firestore': runFirestoreSeedDemo,
        'audit': runAuditLogDemo,
        'validation': runValidationDemo,
        'viewer': runViewerSetupDemo,
        'backend': runBackendSetupDemo,
        'hardhat': runHardhatConfigDemo,
        'typescript': runTypescriptConfigDemo,
        'mint': runMintMeeDemo,
        'ethers': runEthersDemo,
        'badge': runBadgeAwardingDemo,
        'web3auth': runWeb3AuthDemo,
        'wallet': (log) => runWalletBalanceDemo(log, walletAddress),
        'activity': runActivityFeedDemo,
        'governance': runGovernanceDemo,
      };
      if (demos[demoType]) {
        await demos[demoType](addLogEntry);
      }
    } catch (error) {
      console.error("Demo failed:", error);
      addLogEntry({
        type: LogType.Error,
        title: 'An unexpected error occurred during the demo.',
      });
    } finally {
      setDemoRunning('none');
    }
  }, [demoRunning, addLogEntry, walletAddress]);
  
  const handleClearOrBack = () => {
    setLogEntries([]);
    if (showDeployer) {
        setShowDeployer(false);
    }
  }

  const isDemoRunning = demoRunning !== 'none';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            MeeChain Process Visualizer
          </h1>
          <p className="text-gray-400 mt-2">
            A step-by-step simulation of automated MeeChain smart contract flows.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {walletAddress ? (
            <div className="flex items-center space-x-3 bg-gray-800 border border-gray-700 rounded-full py-2 px-4">
              <span className="text-sm font-mono text-green-400">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
              <button onClick={handleDisconnectWallet} title="Disconnect Wallet" className="text-gray-400 hover:text-white transition-colors">
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
            >
              <WalletIcon className="w-5 h-5 mr-2" />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto mb-6">
        {showDeployer ? (
          <SmartContractDeployer 
            addLogEntry={addLogEntry}
            setLogEntries={setLogEntries}
          />
        ) : (
          <div className="space-y-3">
            <DemoCategory title="User & Community Interaction" icon={<UsersIcon className="w-6 h-6 mr-3 text-sky-400"/>} initialOpen={true}>
              <button onClick={() => handleStartDemo('web3auth')} disabled={isDemoRunning} className="demo-button bg-sky-500 hover:bg-sky-600 focus:ring-sky-400">
                <UserCircleIcon className="w-5 h-5 mr-2" /> {demoRunning === 'web3auth' ? 'Running...' : 'Web3 Auth Demo'}
              </button>
              <button onClick={() => handleStartDemo('wallet')} disabled={isDemoRunning} className="demo-button bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
                <WalletIcon className="w-5 h-5 mr-2" /> {demoRunning === 'wallet' ? 'Running...' : 'Check Wallet Balance'}
              </button>
              <button onClick={() => handleStartDemo('ethers')} disabled={isDemoRunning} className="demo-button bg-gray-500 hover:bg-gray-600 focus:ring-gray-400">
                <CurrencySwapIcon className="w-5 h-5 mr-2" /> {demoRunning === 'ethers' ? 'Running...' : 'Token Swap Demo'}
              </button>
              <button onClick={() => handleStartDemo('badge')} disabled={isDemoRunning} className="demo-button bg-amber-500 hover:bg-amber-600 focus:ring-amber-400">
                <AwardIcon className="w-5 h-5 mr-2" /> {demoRunning === 'badge' ? 'Running...' : 'Award Contributor Badge'}
              </button>
              <button onClick={() => handleStartDemo('activity')} disabled={isDemoRunning} className="demo-button bg-rose-600 hover:bg-rose-700 focus:ring-rose-500">
                <ViewListIcon className="w-5 h-5 mr-2" /> {demoRunning === 'activity' ? 'Running...' : 'Activity Feed Demo'}
              </button>
              <button onClick={() => handleStartDemo('governance')} disabled={isDemoRunning} className="demo-button bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500">
                <ScaleIcon className="w-5 h-5 mr-2" /> {demoRunning === 'governance' ? 'Running...' : 'Governance Voting'}
              </button>
            </DemoCategory>
            
            <DemoCategory title="Core Smart Contracts" icon={<CubeIcon className="w-6 h-6 mr-3 text-green-400"/>}>
              <button onClick={() => handleStartDemo('refund')} disabled={isDemoRunning} className="demo-button bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
                <PlayIcon className="w-5 h-5 mr-2" /> {demoRunning === 'refund' ? 'Running...' : 'Refund Demo'}
              </button>
              <button onClick={() => handleStartDemo('supply')} disabled={isDemoRunning} className="demo-button bg-green-600 hover:bg-green-700 focus:ring-green-500">
                <CubeIcon className="w-5 h-5 mr-2" /> {demoRunning === 'supply' ? 'Running...' : 'Supply Contract Demo'}
              </button>
              <button onClick={() => handleStartDemo('deployment')} disabled={isDemoRunning} className="demo-button bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
                <RocketIcon className="w-5 h-5 mr-2" /> {demoRunning === 'deployment' ? 'Running...' : 'Deploy Badge Contract'}
              </button>
              <button onClick={() => handleStartDemo('mint')} disabled={isDemoRunning} className="demo-button bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400">
                <CoinStackIcon className="w-5 h-5 mr-2" /> {demoRunning === 'mint' ? 'Running...' : 'MEE Token Minting'}
              </button>
            </DemoCategory>
            
            <DemoCategory title="Developer & DevOps" icon={<WrenchScrewdriverIcon className="w-6 h-6 mr-3 text-slate-400"/>}>
               <button onClick={() => setShowDeployer(true)} disabled={isDemoRunning} className="demo-button bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 col-span-1 sm:col-span-2 lg:col-span-3">
                  <CloudUploadIcon className="w-5 h-5 mr-2" /> Deploy Smart Contract to Live Network
                </button>
              <button onClick={() => handleStartDemo('hardhat')} disabled={isDemoRunning} className="demo-button bg-slate-600 hover:bg-slate-700 focus:ring-slate-500">
                <WrenchScrewdriverIcon className="w-5 h-5 mr-2" /> {demoRunning === 'hardhat' ? 'Running...' : 'Hardhat Config'}
              </button>
              <button onClick={() => handleStartDemo('typescript')} disabled={isDemoRunning} className="demo-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400">
                <TypeScriptIcon className="w-5 h-5 mr-2" /> {demoRunning === 'typescript' ? 'Running...' : 'TypeScript Config'}
              </button>
              <button onClick={() => handleStartDemo('backend')} disabled={isDemoRunning} className="demo-button bg-red-600 hover:bg-red-700 focus:ring-red-500">
                <ServerIcon className="w-5 h-5 mr-2" /> {demoRunning === 'backend' ? 'Running...' : 'Backend Setup'}
              </button>
              <button onClick={() => handleStartDemo('viewer')} disabled={isDemoRunning} className="demo-button bg-pink-600 hover:bg-pink-700 focus:ring-pink-500">
                <CogIcon className="w-5 h-5 mr-2" /> {demoRunning === 'viewer' ? 'Running...' : 'Viewer Setup'}
              </button>
              <button onClick={() => handleStartDemo('abi')} disabled={isDemoRunning} className="demo-button bg-orange-500 hover:bg-orange-600 focus:ring-orange-400">
                <FileSyncIcon className="w-5 h-5 mr-2" /> {demoRunning === 'abi' ? 'Running...' : 'ABI Sync'}
              </button>
              <button onClick={() => handleStartDemo('firestore')} disabled={isDemoRunning} className="demo-button bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400">
                <DatabaseIcon className="w-5 h-5 mr-2" /> {demoRunning === 'firestore' ? 'Running...' : 'Firestore Seed'}
              </button>
              <button onClick={() => handleStartDemo('audit')} disabled={isDemoRunning} className="demo-button bg-teal-500 hover:bg-teal-600 focus:ring-teal-400">
                <ClipboardListIcon className="w-5 h-5 mr-2" /> {demoRunning === 'audit' ? 'Running...' : 'Audit Log'}
              </button>
              <button onClick={() => handleStartDemo('validation')} disabled={isDemoRunning} className="demo-button bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                <ShieldCheckIcon className="w-5 h-5 mr-2" /> {demoRunning === 'validation' ? 'Running...' : 'Validation'}
              </button>
            </DemoCategory>
          </div>
        )}
        <div className="mt-4">
            <button
              onClick={handleClearOrBack}
              disabled={isDemoRunning && !showDeployer}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
            >
              <RefreshIcon className="w-5 h-5 mr-2"/>
              {showDeployer ? 'Back to Demos' : 'Clear Log'}
            </button>
        </div>
      </div>

      <main 
        ref={logContainerRef} 
        className="flex-grow bg-black/20 rounded-xl border border-gray-800 shadow-2xl p-4 sm:p-6 overflow-y-auto"
        style={{ maxHeight: '65vh' }}
      >
        <div className="space-y-4">
          {logEntries.length === 0 && !isDemoRunning && (
             <div className="text-center text-gray-500 py-16">
                <p className="text-lg">Welcome to the MeeChain Process Visualizer.</p>
                <p>Select a category and click a demo to begin, or use the deployer above.</p>
            </div>
          )}
          {logEntries.map((entry, index) => (
            <LogEntryCard key={`${entry.timestamp}-${index}`} entry={entry} />
          ))}
        </div>
      </main>
      
      <footer className="text-center mt-6 text-sm text-gray-500">
        <p>This is a simulated environment for demonstration purposes.</p>
      </footer>
       <style>{`
          .demo-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              padding: 0.75rem 1rem;
              border: 1px solid transparent;
              font-size: 0.875rem;
              font-weight: 500;
              border-radius: 0.375rem;
              color: white;
              transition: all 0.3s;
              transform-origin: center;
          }
          .demo-button:disabled {
              background-color: #4b5563;
              cursor: not-allowed;
          }
          .demo-button:hover:not(:disabled) {
            transform: scale(1.03);
          }
          .demo-button:focus {
            outline: none;
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
            --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
            --tw-ring-offset-width: 2px;
            --tw-ring-offset-color: #111827;
          }

          .log-entry-card {
              opacity: 0;
              transform: translateY(20px);
              animation: fadeIn 0.5s forwards;
          }
          @keyframes fadeIn {
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
      `}</style>
    </div>
  );
};

export default App;