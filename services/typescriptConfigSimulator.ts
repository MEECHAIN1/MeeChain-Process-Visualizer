import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TSCONFIG_CONTENT = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
  },
  "include": ["src"],
}`;

class TypeScriptConfigService {
  private log: LogUpdater;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }
  
  async runSimulation() {
    this.log({
        type: LogType.Step,
        title: 'Loading TypeScript configuration...',
        details: 'Path: tsconfig.json'
    });
    await delay(1200);

    this.log({
        type: LogType.Code,
        title: '📄 tsconfig.json content',
        code: TSCONFIG_CONTENT
    });
    await delay(2500);

    this.log({
        type: LogType.Info,
        title: 'Key Configuration Options',
        details: [
            'target: "ES2020" - Compiles TypeScript to a modern version of JavaScript that is widely supported.',
            'jsx: "react-jsx" - Enables the modern JSX transform for React, so you don\'t need to import React in every file.',
            'strict: true - Enables all strict type-checking options, helping to catch bugs early.',
            'moduleResolution: "bundler" - Mimics how modern bundlers (like Vite) resolve modules.',
            'include: ["src"] - Tells the TypeScript compiler to only check files within the "src" directory.',
        ]
    });
    await delay(2500);

    this.log({
        type: LogType.Step,
        title: 'Simulating TypeScript compiler (tsc)...',
        code: `> tsc --noEmit`
    });
    await delay(1500);
    
    this.log({
        type: LogType.Info,
        title: 'Checking files in "src/" directory...'
    });
    await delay(500);
    this.log({ type: LogType.Success, title: 'Checked: src/App.tsx' });
    await delay(300);
    this.log({ type: LogType.Success, title: 'Checked: src/types.ts' });
    await delay(300);
    this.log({ type: LogType.Success, title: 'Checked: src/components/LogEntryCard.tsx' });
    await delay(300);
    this.log({ type: LogType.Success, title: 'Checked: src/services/refundSimulator.ts' });
    await delay(800);
    
    this.log({
        type: LogType.Error,
        title: 'Found 1 type error in simulated file...',
        details: 'src/utils/helpers.ts(4,5): Type \'string\' is not assignable to type \'number\'.'
    });
    await delay(1500);

    this.log({
        type: LogType.Step,
        title: 'Simulating fix...',
        details: 'Correcting the type mismatch.'
    });
    await delay(1000);
    
    this.log({
        type: LogType.Success,
        title: '✅ Re-checked: src/utils/helpers.ts'
    });
    await delay(1000);
  }
}

export async function runTypescriptConfigDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'TypeScript Configuration Demo',
    details: 'Simulating how tsconfig.json is used to enforce type safety and code quality.'
  });
  await delay(1000);

  const configService = new TypeScriptConfigService(log);
  await configService.runSimulation();

  log({
    type: LogType.Complete,
    title: '🎉 TypeScript Configuration Verified!',
    details: [
        '✅ The TypeScript environment is correctly configured for this project.',
        '✅ Strict type-checking helps ensure code reliability and maintainability.',
    ]
  });
}