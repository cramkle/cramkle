import fetch from 'node-fetch'

interface SandboxContext {
  requestUrl: string
  forwardCookie?: string
}

const createSandbox = (ctx: SandboxContext) => {
  const timerHandlers: NodeJS.Timer[] = []
  const logs: string[] = []
  const warnings: string[] = []
  const errors: string[] = []

  const timerProxy = (target: Function, thisArg: any, argumentList: any) => {
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

  const fetchProxy = new Proxy(fetch, {
    apply: (target, thisArg, [urlOrRequest, init]) => {
      init.headers = {
        ...init.headers,
        ...(ctx.forwardCookie && { cookie: ctx.forwardCookie }),
      }

      return target.apply(thisArg, [urlOrRequest, init])
    },
  })

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
      log: (...args: any[]) => {
        logs.push(args.join(' '))
      },
      error: (...args: any[]) => {
        errors.push(args.join(' '))
      },
      warn: (...args: any[]) => {
        warnings.push(args.join(' '))
      },
    },
    fetch: fetchProxy,
    clearInterval,
    clearTimeout,
    setInterval: setIntervalProxy,
    setTimeout: setTimeoutProxy,
    require,
    module: { exports: {} },
    exports: this.module.exports,
    requestUrl: ctx.requestUrl,
    // @ts-ignore
    rendered: null as Promise<RenderResult>,
    window: this,
    self: this,
    global: this,
  }

  sandbox.exports = module.exports
  sandbox.window = sandbox
  sandbox.self = sandbox
  sandbox.global = sandbox

  return { sandbox, cleanUp, getLogsAndErrors }
}

export default createSandbox
