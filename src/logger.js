import log from 'loglevel';

// Utility to get a logger instance for a specific component
// Set log level for this component (can be 'trace', 'debug', 'info', 'warn', 'error')
export function getLogger(name) {
  const logger = log.getLogger(name);
  // Default log level can be set here, or per component in your code
  logger.setLevel('warn');
  return logger;
}

// Optionally, set a global default log level
log.setLevel('warn'); // Only show warnings and errors globally by default

