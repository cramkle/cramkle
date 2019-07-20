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

logStore.subscribe(state => {
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
