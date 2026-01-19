const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (prefix: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(prefix, ...args);
    }
  },
  warn: (prefix: string, ...args: unknown[]) => {
    console.warn(prefix, ...args);
  },
  error: (prefix: string, ...args: unknown[]) => {
    console.error(prefix, ...args);
  },
  debug: (prefix: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(prefix, ...args);
    }
  },
};
