import { LogEntryData, LogType } from '../types';

type LogUpdater = (entry: Omit<LogEntryData, 'timestamp'>) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ValidationService {
  private log: LogUpdater;
  private errors = 0;
  private warnings = 0;

  constructor(logUpdater: LogUpdater) {
    this.log = logUpdater;
  }

  private checkFile(path: string, optional = false) {
    const exists = Math.random() > 0.2; // 80% chance of existing
    if (exists) {
      this.log({ type: LogType.Success, title: `✅ Found: ${path}` });
    } else {
      if (optional) {
        this.warnings++;
        this.log({ type: LogType.Info, title: `⚠️ Optional: ${path}` });
      } else {
        this.errors++;
        this.log({ type: LogType.Error, title: `❌ Missing: ${path}` });
      }
    }
  }
  
  async runValidation() {
    this.log({ type: LogType.Info, title: '🔍 Validating Automated Deploy Workflow Setup...' });
    await delay(1000);

    this.log({ type: LogType.Step, title: '📋 Checking Workflow Files...' });
    await delay(500);
    this.checkFile('.github/workflows/automate-deploy.yml');
    await delay(300);
    
    this.log({ type: LogType.Step, title: '📋 Checking Documentation Files...' });
    await delay(500);
    this.checkFile('WORKFLOW_GUIDE.md');
    await delay(300);
    this.checkFile('SECRETS_SETUP.md');
    await delay(300);

    this.log({ type: LogType.Step, title: '📋 Checking Viewer Files...' });
    await delay(500);
    this.checkFile('docs/index.html');
    await delay(300);
    this.checkFile('docs/status/patch-status.json');
    await delay(300);

    this.log({ type: LogType.Step, title: '📋 Checking Optional Assets...' });
    await delay(500);
    this.checkFile('docs/assets/logo.png', true);
    await delay(300);
    this.checkFile('docs/assets/splash.png', true);
    await delay(300);
    
    this.log({ type: LogType.Step, title: '📋 Validating Workflow YAML...' });
    await delay(800);
    this.log({ type: LogType.Success, title: '✅ YAML syntax valid' });
    await delay(300);
    
    this.log({ type: LogType.Step, title: '📋 Validating JSON...' });
    await delay(800);
    const jsonValid = Math.random() > 0.3;
    if (jsonValid) {
        this.log({ type: LogType.Success, title: '✅ JSON syntax valid' });
    } else {
        this.errors++;
        this.log({ type: LogType.Error, title: '❌ JSON syntax error' });
    }
    await delay(800);

    this.log({ type: LogType.Step, title: '📋 Checking GitHub Configuration...' });
    await delay(500);
    this.log({
        type: LogType.Info,
        title: '⚠️ Manual check required: GitHub Pages',
        details: [
            '1. Go to Settings → Pages',
            '2. Ensure source is set to "gh-pages" branch'
        ]
    });
    this.warnings++;
    await delay(1000);

    this.log({ type: LogType.Step, title: '📋 Checking GitHub Secrets...' });
    await delay(500);
    this.log({
        type: LogType.Info,
        title: '⚠️ Manual check required: GitHub Secrets',
        details: [
            '1. Go to Settings → Secrets → Actions',
            '2. Ensure SIGNING_CERT_PFX exists',
            '3. Ensure SIGNING_CERT_PASSWORD exists'
        ]
    });
    this.warnings++;
    await delay(1500);

    this.log({ type: LogType.State, title: '📊 Validation Summary' });
    await delay(500);

    if (this.errors === 0 && this.warnings <= 2) {
        this.log({ type: LogType.Success, title: `✅ All critical checks passed! (${this.warnings} warning(s))` });
        this.log({
            type: LogType.Info,
            title: 'Next steps:',
            details: [
                '1. Configure GitHub Secrets (see SECRETS_SETUP.md)',
                '2. Enable GitHub Pages (Settings → Pages)',
                '3. Run workflow (Actions → Automated Deploy and Release)',
            ]
        });
    } else if (this.errors === 0) {
        this.log({ type: LogType.Info, title: `⚠️ ${this.warnings} warning(s) found` });
        this.log({
            type: LogType.Info,
            title: 'The workflow should work, but review warnings above.',
        });
    } else {
        this.log({ type: LogType.Error, title: `❌ ${this.errors} error(s) found` });
        if (this.warnings > 0) {
            this.log({ type: LogType.Info, title: `⚠️ ${this.warnings} warning(s) found` });
        }
        this.log({
            type: LogType.Info,
            title: 'Please fix the errors above before running the workflow.',
        });
    }
  }
}

export async function runValidationDemo(logUpdater: LogUpdater) {
  const log = logUpdater;

  log({
    type: LogType.Header,
    title: 'Automated Deploy Workflow Validation',
    details: 'Simulating a script to check that all required files and configurations are in place.'
  });
  await delay(1000);

  const validationService = new ValidationService(log);
  await validationService.runValidation();

  await delay(1000);
  log({
    type: LogType.Complete,
    title: '🎉 Validation complete!',
  });
}