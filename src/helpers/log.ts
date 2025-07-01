import * as fs from 'fs';
import * as path from 'path';

export const log = (message: unknown): void => {
  const logDir = path.join(__dirname, '../../.logs');
  const logPath = path.join(logDir, 'app.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const stringifiedMessage = JSON.stringify(message, null, 2);

  const date = new Date().toISOString();

  fs.appendFileSync(logPath, `${date} - ${stringifiedMessage}\n`);
};
