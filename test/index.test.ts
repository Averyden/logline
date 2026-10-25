//* TESTING SANDBOX.

import { ConsoleTransport, createLogger } from '../src'

const logger = createLogger({
  service: 'logline',
  environment: 'development',
  minLevel: 'debug',
  transports: [new ConsoleTransport()],
})

logger.debug('Debugging the logger')
logger.info('Application started', {
  metadata: { port: 3000 },
})
logger.warn('Something looks unusual')
logger.error('Something failed', new Error('Example error'))
logger.fatal('Critical failure')
