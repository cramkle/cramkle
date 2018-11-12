const fetch = require('node-fetch')

const createSandbox = (basePath, requestUrl) => {
  const timerHandlers = []
  const logs = []
  const warnings = []
  const errors = []

  const timerProxy = (target, thisArg, argumentList) => {
    const handler = target.apply(thisArg, argumentList)

    timerHandlers.push(handler)

    return handler
  }

  const setTimeoutProxy = new Proxy(setTimeout, {
    apply: timerProxy,
  })

  const setIntervalProxy = new Proxy(setInterval, {
    apply: timerProxy,
  })

  const disposeTimers = () => {
    timerHandlers.forEach(handler => {
      clearTimeout(handler)
      handler.unref()
    })
  }

  const cleanLogs = () => {
    logs.length = 0
    warnings.length = 0
    errors.length = 0
  }

  const cleanUp = () => {
    disposeTimers()
    cleanLogs()
  }

  const getLogsAndErrors = () => {
    return {
      logs: logs.splice(0),
      warnings: warnings.splice(0),
      errors: errors.splice(0),
    }
  }

  const sandbox = {
    Promise,
    console: {
      log: (...args) => {
        logs.push(args.join(' '))
      },
      error: (...args) => {
        errors.push(args.join(' '))
      },
      warn: (...args) => {
        warnings.push(args.join(' '))
      },
    },
    fetch,
    clearInterval,
    clearTimeout,
    setInterval: setIntervalProxy,
    setTimeout: setTimeoutProxy,
    require,
    module: { exports: {} },
    requestUrl,
  }

  sandbox.window = sandbox
  sandbox.self = sandbox
  sandbox.global = sandbox

  return { sandbox, cleanUp, getLogsAndErrors }
}

module.exports = createSandbox
