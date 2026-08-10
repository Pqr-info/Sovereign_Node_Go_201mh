import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface SubstrateContextState {
  api: ApiPromise | null;
  isApiReady: boolean;
  account: InjectedAccountWithMeta | null;
  connectWallet: () => Promise<void>;
}

// Polyfill to prevent "Cannot read properties of undefined (reading 'polkadot-js')" error
if (typeof window !== 'undefined' && !window.injectedWeb3) {
  (window as any).injectedWeb3 = {};
}

const SubstrateContext = createContext<SubstrateContextState | undefined>(undefined);

export const SubstrateProvider = ({ children }: { children: ReactNode }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);

  useEffect(() => {
    const initApi = async () => {
      // Connecting to the local node by default, but we should make this configurable via env vars if needed
      const provider = new WsProvider('ws://127.0.0.1:9944');
      const api = await ApiPromise.create({ provider });
      
      setApi(api);
      setIsApiReady(true);
    };

    initApi().catch(console.error);
  }, []);

  const connectWallet = async () => {
    try {
      const extensions = await web3Enable('Sovereign-27 Marketplace');
      if (extensions.length === 0) {
        alert('Please install Polkadot-JS extension');
        return;
      }
      
      const allAccounts = await web3Accounts();
      if (allAccounts.length > 0) {
        setAccount(allAccounts[0]); // Select first account for now
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  return (
    <SubstrateContext.Provider value={{ api, isApiReady, account, connectWallet }}>
      {children}
    </SubstrateContext.Provider>
  );
};

export const useSubstrate = () => {
  const context = useContext(SubstrateContext);
  if (context === undefined) {
    throw new Error('useSubstrate must be used within a SubstrateProvider');
  }
  return context;
};
