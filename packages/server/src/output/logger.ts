import createStore from 'unistore'

import * as Log from './log'

type WebpackState =
  | { loading: true }
  | {
      loading: false
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
    Log.info('starting the development server')
    if (state.port !== null) {
      Log.wait(`waiting on http://localhost:${state.port}`)
    }
    return
  }

  if (state.loading === true) {
    Log.wait('compiling...')
    return
  }

  if (state.errors) {
    Log.error(state.errors[0])
    return
  }

  if (state.warnings) {
    Log.warn(state.warnings.join('\n\n'))
    Log.info('ready')
    return
  }

  Log.ready('compiled successfully')
})
