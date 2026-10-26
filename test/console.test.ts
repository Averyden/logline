import { expect, spyOn, test } from 'bun:test'
import type { LogEntry } from '../src/core/types'
import { ConsoleTransport } from '../src/transports/console'

test('filters entries below the console transport minimum level', () => {
  const infoSpy = spyOn(console, 'info')
  const errorSpy = spyOn(console, 'error')

  try {
    const transport = new ConsoleTransport({ minLevel: 'error' })
    const entry: LogEntry = {
      timestamp: new Date('2026-10-25T12:00:00.000Z'),
      level: 'info',
      message: 'Filtered',
    }

    transport.log(entry)
    expect(infoSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()

    transport.log({ ...entry, level: 'error', message: 'Accepted' })
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[2026-10-25T12:00:00.000Z] [ERROR] Accepted',
      '',
    )
  } finally {
    infoSpy.mockRestore()
    errorSpy.mockRestore()
  }
})
