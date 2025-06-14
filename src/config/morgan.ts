import morgan from 'morgan';
import { StreamOptions } from 'morgan';
import { createWriteStream } from 'fs';
import { join } from 'path';

// Custom token để log request body
morgan.token('body', (req: any) => JSON.stringify(req.body));

// Custom token để log response time
morgan.token('response-time', (req: any, res: any) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  const time = diff[0] * 1e3 + diff[1] * 1e-6;
  return time.toFixed(2);
});

// Custom format cho development
const devFormat = ':method :url :status :response-time ms - :res[content-length] - :body';

// Custom format cho production
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Cấu hình stream để ghi log vào file
const accessLogStream = createWriteStream(
  join(__dirname, '../../logs/access.log'),
  { flags: 'a' }
);

// Stream options
const streamOptions: StreamOptions = {
  write: (message: string) => {
    accessLogStream.write(message);
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(message.trim());
    }
  },
};

// Morgan middleware cho development
export const morganDev = morgan(devFormat, {
  stream: streamOptions,
  skip: (req, res) => res.statusCode >= 400, // Skip logging for errors
});

// Morgan middleware cho production
export const morganProd = morgan(prodFormat, {
  stream: streamOptions,
  skip: (req, res) => res.statusCode >= 400,
});
