import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const WEB3AUTH_CONFIG = {
    clientId: "BC8MD0duuupxSQpN5zFa5hD8NydLkJXekKAxjLmgPCmnV13HYhEVV3Jt3B7aKtczDbBtjYXjYbNOrR1JqIzQYjQ",
    chainConfig: {
        chainNamespace: "eip155",
        chainId: "0xaa36a7",
        rpcTarget: "https://rpc.sepolia.org",
        displayName: "Sepolia Testnet",
    },
    network: "sapphire_mainnet"
};

class Web3AuthService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    this.log({
        type: LogType.Step,
        title: 'Initializing Web3Auth SDK...',
    });
    await delay(1200);

    this.log({
        type: LogType.Code,
        title: 'Loaded Configuration',
        code: JSON.stringify(WEB3AUTH_CONFIG, null, 2)
    });
    await delay(2000);

    this.log({
        type: LogType.Info,
        title: 'Configuring Adapters...',
        details: [
            '- OpenloginAdapter (For social logins like Google, Email, etc.)',
            '- MetamaskAdapter (For direct connection with MetaMask extension)',
        ]
    });
    await delay(1500);

    this.log({
        type: LogType.Success,
        title: '✅ Web3Auth Initialized and Ready'
    });
    await delay(1000);

    this.log({
        type: LogType.Step,
        title: 'Triggering Login Modal...',
        details: 'Simulating user clicking the "Login" button.'
    });
    await delay(1500);

    this.log({
        type: LogType.Info,
        title: 'User selected "Social Login"...',
        details: 'Simulating a popup/redirect to Google for authentication.'
    });
    await delay(2500);

    const userInfo = {
        email: "contributor@example.com",
        name: "Alex Doe",
        profileImage: "https://example.com/avatar.png",
        aggregateVerifier: "google",
        verifierId: "alex.doe@google.com",
    };
    
    const userAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    this.log({
        type: LogType.Success,
        title: '✅ Login Successful!',
        details: `Retrieved user info and generated a public address for the user.`
    });
    await delay(1500);

    this.log({
        type: LogType.State,
        title: 'Authenticated User State',
        code: JSON.stringify({ ...userInfo, publicAddress: userAddress }, null, 2)
    });
    await delay(2000);
  }
}

export async function runWeb3AuthDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Web3 Authentication Demo',
    details: 'Simulating a seamless user login flow using Web3Auth for social and wallet-based authentication.'
  });
  await delay(1000);

  const authService = new Web3AuthService(log);
  await authService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 Authentication Flow Complete!',
    details: [
        '✅ A secure, non-custodial wallet was generated for the user.',
        '✅ The user is now logged in and can interact with the dApp.',
        '✅ This flow provides a familiar Web2 experience for Web3 onboarding.',
    ]
  });
}
