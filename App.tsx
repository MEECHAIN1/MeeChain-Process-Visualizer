
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LogEntryData, LogType, SyncStatus } from './types';
import LogEntryCard from './components/LogEntryCard';
import DemoCategory from './components/DemoCategory';
import SmartContractDeployer from './components/SmartContractDeployer';
import { MeeBotProvider, useMeeBot } from './context/MeeBotContext';
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
import { runLeaderboardDemo } from './services/leaderboardSimulator';
import { runMiningSyncDemo } from './services/miningSyncSimulator';
import { 
  PlayIcon, RefreshIcon, RocketIcon, CubeIcon, FileSyncIcon, DatabaseIcon, 
  ClipboardListIcon, ShieldCheckIcon, CogIcon, ServerIcon, WrenchScrewdriverIcon, 
  TypeScriptIcon, CoinStackIcon, CurrencySwapIcon, AwardIcon, UserCircleIcon, 
  WalletIcon, ViewListIcon, ScaleIcon, UsersIcon, LogoutIcon, CloudUploadIcon, 
  ChartBarIcon, SignalIcon, CheckCircleIcon 
} from './components/icons';

type DemoType = 'none' | 'refund' | 'deployment' | 'supply' | 'abi' | 'firestore' | 'audit' | 'validation' | 'viewer' | 'backend' | 'hardhat' | 'typescript' | 'mint' | 'ethers' | 'badge' | 'web3auth' | 'wallet' | 'activity' | 'governance' | 'leaderboard' | 'miningSync';

const AppContent: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntryData[]>([]);
  const [demoRunning, setDemoRunning] = useState<DemoType>('none');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDeployer, setShowDeployer] = useState(false);
  const [refundNote, setRefundNote] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { miningState, updateMiningState, processMiningEvent } = useMeeBot();

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
        'refund': (log: any) => runRefundDemo(log, refundNote),
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
        'wallet': (log: any) => runWalletBalanceDemo(log, walletAddress),
        'activity': runActivityFeedDemo,
        'governance': runGovernanceDemo,
        'leaderboard': runLeaderboardDemo,
        'miningSync': (log: any) => runMiningSyncDemo(log, processMiningEvent),
      };
      if (demos[demoType]) {
        await (demos[demoType] as any)(addLogEntry);
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
  }, [demoRunning, addLogEntry, walletAddress, refundNote, processMiningEvent]);
  
  const handleClearOrBack = () => {
    setLogEntries([]);
    if (showDeployer) {
        setShowDeployer(false);
    }
  }

  const getSyncBadge = (status: SyncStatus) => {
    switch (status) {
      case 'synced': return <div className="flex items-center text-[10px] text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded border border-green-400/30"><CheckCircleIcon className="w-3 h-3 mr-1" /> SYNCED</div>;
      case 'pending_on_chain': return <div className="flex items-center text-[10px] text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30 animate-pulse"><SignalIcon className="w-3 h-3 mr-1" /> PENDING ON-CHAIN</div>;
      default: return <div className="text-[10px] text-gray-500 font-bold px-2 py-0.5 border border-gray-700 rounded">IDLE</div>;
    }
  }

  const isDemoRunning = demoRunning !== 'none';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            MeeChain Visualizer
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Automated Smart Contract & Real-time State Flows
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Enhanced Mining Stats Widget */}
          <div className="flex flex-col items-center bg-gray-800/50 border border-gray-700 rounded-lg p-2 min-w-[160px] shadow-lg">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] uppercase text-gray-500 font-black tracking-tighter">Blockchain Sync Status</span>
              {getSyncBadge(miningState.syncStatus)}
            </div>
            <div className="flex items-center justify-center space-x-4 w-full px-2 py-1 bg-black/20 rounded">
              <div className="text-center">
                <span className="block text-[8px] uppercase text-gray-500 font-bold">Lvl</span>
                <span className="text-blue-400 font-mono text-xs font-bold">{miningState.level}</span>
              </div>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="text-center">
                <span className="block text-[8px] uppercase text-gray-500 font-bold">Points</span>
                <span className="text-teal-400 font-mono text-xs font-bold">{miningState.points}</span>
              </div>
            </div>
          </div>

          {walletAddress ? (
            <div className="flex items-center space-x-3 bg-gray-800 border border-gray-700 rounded-full py-2 px-4 shadow-inner">
              <span className="text-sm font-mono text-green-400">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
              <button onClick={handleDisconnectWallet} title="Disconnect Wallet" className="text-gray-400 hover:text-white transition-colors">
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors shadow-lg"
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
            <DemoCategory title="Real-time Consistency & Mining" icon={<SignalIcon className="w-6 h-6 mr-3 text-blue-400"/>} initialOpen={true}>
              <button onClick={() => handleStartDemo('miningSync')} disabled={isDemoRunning} className="demo-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400">
                <SignalIcon className="w-5 h-5 mr-2" /> {demoRunning === 'miningSync' ? 'Syncing...' : 'Cross-Layer Sync'}
              </button>
              <button onClick={() => handleStartDemo('leaderboard')} disabled={isDemoRunning} className="demo-button bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400">
                <ChartBarIcon className="w-5 h-5 mr-2" /> {demoRunning === 'leaderboard' ? 'Running...' : 'Live Leaderboard'}
              </button>
              <button onClick={() => handleStartDemo('activity')} disabled={isDemoRunning} className="demo-button bg-rose-600 hover:bg-rose-700 focus:ring-rose-500">
                <ViewListIcon className="w-5 h-5 mr-2" /> {demoRunning === 'activity' ? 'Running...' : 'Audit Activity'}
              </button>
            </DemoCategory>

            <DemoCategory title="User & Community Interaction" icon={<UsersIcon className="w-6 h-6 mr-3 text-sky-400"/>}>
              <button onClick={() => handleStartDemo('web3auth')} disabled={isDemoRunning} className="demo-button bg-sky-500 hover:bg-sky-600 focus:ring-sky-400">
                <UserCircleIcon className="w-5 h-5 mr-2" /> {demoRunning === 'web3auth' ? 'Running...' : 'Web3 Auth'}
              </button>
              <button onClick={() => handleStartDemo('wallet')} disabled={isDemoRunning} className="demo-button bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
                <WalletIcon className="w-5 h-5 mr-2" /> {demoRunning === 'wallet' ? 'Running...' : 'Wallet Read'}
              </button>
              <button onClick={() => handleStartDemo('ethers')} disabled={isDemoRunning} className="demo-button bg-gray-500 hover:bg-gray-600 focus:ring-gray-400">
                <CurrencySwapIcon className="w-5 h-5 mr-2" /> {demoRunning === 'ethers' ? 'Running...' : 'DEX Interaction'}
              </button>
              <button onClick={() => handleStartDemo('badge')} disabled={isDemoRunning} className="demo-button bg-amber-500 hover:bg-amber-600 focus:ring-amber-400">
                <AwardIcon className="w-5 h-5 mr-2" /> {demoRunning === 'badge' ? 'Running...' : 'SBT Awarding'}
              </button>
              <button onClick={() => handleStartDemo('governance')} disabled={isDemoRunning} className="demo-button bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500">
                <ScaleIcon className="w-5 h-5 mr-2" /> {demoRunning === 'governance' ? 'Running...' : 'DAO Voting'}
              </button>
            </DemoCategory>
            
            <DemoCategory title="Core Ecosystem Contracts" icon={<CubeIcon className="w-6 h-6 mr-3 text-green-400"/>}>
              <div className="col-span-full bg-gray-700/30 p-4 rounded-lg mb-2 border border-gray-600/50">
                <label className="block text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">Refund Process Customization</label>
                <input 
                  type="text" 
                  placeholder="Add a custom note to the refund log..."
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isDemoRunning}
                />
              </div>
              <button onClick={() => handleStartDemo('refund')} disabled={isDemoRunning} className="demo-button bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
                <PlayIcon className="w-5 h-5 mr-2" /> {demoRunning === 'refund' ? 'Running...' : 'Refund Logic'}
              </button>
              <button onClick={() => handleStartDemo('supply')} disabled={isDemoRunning} className="demo-button bg-green-600 hover:bg-green-700 focus:ring-green-500">
                <CubeIcon className="w-5 h-5 mr-2" /> {demoRunning === 'supply' ? 'Running...' : 'Supply Protocol'}
              </button>
              <button onClick={() => handleStartDemo('deployment')} disabled={isDemoRunning} className="demo-button bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
                <RocketIcon className="w-5 h-5 mr-2" /> {demoRunning === 'deployment' ? 'Running...' : 'Contract Deploy'}
              </button>
              <button onClick={() => handleStartDemo('mint')} disabled={isDemoRunning} className="demo-button bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400">
                <CoinStackIcon className="w-5 h-5 mr-2" /> {demoRunning === 'mint' ? 'Running...' : 'MEE Minting'}
              </button>
            </DemoCategory>
            
            <DemoCategory title="DevOps & Tooling" icon={<WrenchScrewdriverIcon className="w-6 h-6 mr-3 text-slate-400"/>}>
               <button onClick={() => setShowDeployer(true)} disabled={isDemoRunning} className="demo-button bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 col-span-1 sm:col-span-2 lg:col-span-3">
                  <CloudUploadIcon className="w-5 h-5 mr-2" /> Deploy Smart Contract to Live Network
                </button>
              <button onClick={() => handleStartDemo('hardhat')} disabled={isDemoRunning} className="demo-button bg-slate-600 hover:bg-slate-700 focus:ring-slate-500">
                <WrenchScrewdriverIcon className="w-5 h-5 mr-2" /> {demoRunning === 'hardhat' ? 'Running...' : 'Hardhat Environment'}
              </button>
              <button onClick={() => handleStartDemo('typescript')} disabled={isDemoRunning} className="demo-button bg-blue-500 hover:bg-blue-600 focus:ring-blue-400">
                <TypeScriptIcon className="w-5 h-5 mr-2" /> {demoRunning === 'typescript' ? 'Running...' : 'Static Analysis'}
              </button>
              <button onClick={() => handleStartDemo('backend')} disabled={isDemoRunning} className="demo-button bg-red-600 hover:bg-red-700 focus:ring-red-500">
                <ServerIcon className="w-5 h-5 mr-2" /> {demoRunning === 'backend' ? 'Running...' : 'Backend Config'}
              </button>
              <button onClick={() => handleStartDemo('viewer')} disabled={isDemoRunning} className="demo-button bg-pink-600 hover:bg-pink-700 focus:ring-pink-500">
                <CogIcon className="w-5 h-5 mr-2" /> {demoRunning === 'viewer' ? 'Running...' : 'Vite Viewer Setup'}
              </button>
              <button onClick={() => handleStartDemo('abi')} disabled={isDemoRunning} className="demo-button bg-orange-500 hover:bg-orange-600 focus:ring-orange-400">
                <FileSyncIcon className="w-5 h-5 mr-2" /> {demoRunning === 'abi' ? 'Running...' : 'ABI Sync Pipeline'}
              </button>
              <button onClick={() => handleStartDemo('firestore')} disabled={isDemoRunning} className="demo-button bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400">
                <DatabaseIcon className="w-5 h-5 mr-2" /> {demoRunning === 'firestore' ? 'Running...' : 'NoSQL Seeding'}
              </button>
              <button onClick={() => handleStartDemo('audit')} disabled={isDemoRunning} className="demo-button bg-teal-500 hover:bg-teal-600 focus:ring-teal-400">
                <ClipboardListIcon className="w-5 h-5 mr-2" /> {demoRunning === 'audit' ? 'Running...' : 'Admin Audit'}
              </button>
              <button onClick={() => handleStartDemo('validation')} disabled={isDemoRunning} className="demo-button bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                <ShieldCheckIcon className="w-5 h-5 mr-2" /> {demoRunning === 'validation' ? 'Running...' : 'Integrity Check'}
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
              {showDeployer ? 'Back to scenarios' : 'Reset Visualizer'}
            </button>
        </div>
      </div>

      <main 
        ref={logContainerRef} 
        className="flex-grow bg-black/20 rounded-xl border border-gray-800 shadow-2xl p-4 sm:p-6 overflow-y-auto backdrop-blur-sm"
        style={{ maxHeight: '65vh' }}
      >
        <div className="space-y-4">
          {logEntries.length === 0 && !isDemoRunning && (
             <div className="text-center text-gray-500 py-16">
                <p className="text-lg">System initialized. Awaiting sequence selection.</p>
                <p className="text-sm mt-2">Observe real-time synchronization between Smart Contracts and Distributed Databases.</p>
            </div>
          )}
          {logEntries.map((entry, index) => (
            <LogEntryCard key={`${entry.timestamp}-${index}`} entry={entry} />
          ))}
        </div>
      </main>
      
      <footer className="text-center mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        <p>Real-time State Sync Enabled • Firestore Snapshot Protocol • MeeChain Node Connectivity: High</p>
      </footer>
       <style>{`
          .demo-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              padding: 0.75rem 1rem;
              border: 1px solid rgba(255,255,255,0.05);
              font-size: 0.8rem;
              font-weight: 700;
              letter-spacing: 0.025em;
              border-radius: 0.5rem;
              color: white;
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              transform-origin: center;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .demo-button:disabled {
              background-color: #1f2937;
              color: #4b5563;
              cursor: not-allowed;
              box-shadow: none;
          }
          .demo-button:hover:not(:disabled) {
            transform: translateY(-2px);
            filter: brightness(1.2);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .demo-button:active:not(:disabled) {
            transform: translateY(0);
          }
          .log-entry-card {
              opacity: 0;
              transform: scale(0.98) translateY(10px);
              animation: slideIn 0.4s forwards cubic-bezier(0.23, 1, 0.32, 1);
          }
          @keyframes slideIn {
              to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
              }
          }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MeeBotProvider>
      <AppContent />
    </MeeBotProvider>
  );
};

export default App;
