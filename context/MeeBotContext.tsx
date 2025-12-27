
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MiningState, SyncStatus } from '../types';

interface MeeBotContextType {
  miningState: MiningState;
  updateMiningState: (newState: Partial<MiningState>) => void;
  processMiningEvent: (points: number, status: SyncStatus) => void;
  startRealTimeSync: (userId: string) => void;
  stopRealTimeSync: () => void;
}

const MeeBotContext = createContext<MeeBotContextType | undefined>(undefined);

export const MeeBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [miningState, setMiningState] = useState<MiningState>({
    points: 0,
    level: 1,
    lastMined: 0,
    isSyncing: false,
    syncStatus: 'idle',
  });

  const updateMiningState = useCallback((newState: Partial<MiningState>) => {
    setMiningState(prev => {
      const updated = { ...prev, ...newState };
      // Automatic Level Calculation (1 level per 100 points)
      updated.level = Math.floor(updated.points / 100) + 1;
      return updated;
    });
  }, []);

  const processMiningEvent = useCallback((points: number, status: SyncStatus) => {
    setMiningState(prev => {
      const newPoints = prev.points + points;
      return {
        ...prev,
        points: newPoints,
        level: Math.floor(newPoints / 100) + 1,
        lastMined: Date.now(),
        syncStatus: status,
        isSyncing: status === 'pending_on_chain'
      };
    });
  }, []);

  const startRealTimeSync = useCallback((userId: string) => {
    setMiningState(prev => ({ ...prev, isSyncing: true }));
    // Simulate initial fetch from Firestore
    setTimeout(() => {
      setMiningState(prev => ({ ...prev, isSyncing: false, syncStatus: 'synced' }));
    }, 1000);
  }, []);

  const stopRealTimeSync = useCallback(() => {
    setMiningState(prev => ({ ...prev, isSyncing: false, syncStatus: 'idle' }));
  }, []);

  return (
    <MeeBotContext.Provider value={{ 
      miningState, 
      updateMiningState, 
      processMiningEvent,
      startRealTimeSync, 
      stopRealTimeSync 
    }}>
      {children}
    </MeeBotContext.Provider>
  );
};

export const useMeeBot = () => {
  const context = useContext(MeeBotContext);
  if (context === undefined) {
    throw new Error('useMeeBot must be used within a MeeBotProvider');
  }
  return context;
};
