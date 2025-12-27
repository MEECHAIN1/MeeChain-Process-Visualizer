
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MiningState } from '../types';

interface MeeBotContextType {
  miningState: MiningState;
  updateMiningState: (newState: Partial<MiningState>) => void;
  syncWithFirestore: () => Promise<void>;
}

const MeeBotContext = createContext<MeeBotContextType | undefined>(undefined);

export const MeeBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [miningState, setMiningState] = useState<MiningState>({
    points: 0,
    level: 1,
    lastMined: 0,
    isSyncing: false,
  });

  const updateMiningState = useCallback((newState: Partial<MiningState>) => {
    setMiningState(prev => ({ ...prev, ...newState }));
  }, []);

  const syncWithFirestore = useCallback(async () => {
    setMiningState(prev => ({ ...prev, isSyncing: true }));
    // In a real app, this is where the onSnapshot listener would be managed
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMiningState(prev => ({ ...prev, isSyncing: false }));
  }, []);

  return (
    <MeeBotContext.Provider value={{ miningState, updateMiningState, syncWithFirestore }}>
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
