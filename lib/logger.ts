type LogLevel = 'info' | 'warn' | 'error'

export function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  }

  // In a production environment, you might want to send this to a logging service
  console.log(JSON.stringify(logEntry))
}

