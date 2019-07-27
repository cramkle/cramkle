import createStore from 'unistore'

import * as Log from './log'

type WebpackState =
  | { loading: true }
  | {
      loading: false
      typeChecking: boolean
      errors: string[] | null
      warnings: string[] | null
    }

export type LoggerStoreStatus =
  | { bootstrap: true; port: number | null }
  | ({ bootstrap: false; port: number | null } & WebpackState)

export const logStore = createStore<LoggerStoreStatus>({
  bootstrap: true,
  port: null,
})

let lastStore: LoggerStoreStatus = {} as any
function hasStoreChanged(nextStore: LoggerStoreStatus) {
  if (
    [...new Set([...Object.keys(lastStore), ...Object.keys(nextStore)])].every(
      key => Object.is((lastStore as any)[key], (nextStore as any)[key])
    )
  ) {
    return false
  }

  lastStore = nextStore
  return true
}

logStore.subscribe(state => {
  if (!hasStoreChanged(state)) {
    return
  }

  if (state.bootstrap === true) {
    Log.wait('starting the development server')
    if (state.port !== null) {
      Log.info(`waiting on http://localhost:${state.port}`)
    }
    return
  }

  if (state.loading === true) {
    Log.wait('compiling...')
    return
  }

  if (state.errors && state.errors.length > 0) {
    Log.error(state.errors[0])
    return
  }

  const appUrl = `http://localhost:${state.port}`

  if (state.warnings && state.warnings.length > 0) {
    Log.warn(state.warnings.join('\n\n'))
    Log.info(`ready on ${appUrl}`)
    return
  }

  if (state.typeChecking) {
    Log.info('bundled successfully, waiting for type checking')
    return
  }

  Log.ready(`compiled successfully - ready on ${appUrl}`)
})
