import createStore from 'unistore'
import { Compiler } from 'webpack'

import { LoggerStoreStatus, logStore } from './logger'

interface CompilerDiagnostics {
  errors: string[] | null
  warnings: string[] | null
}

type WebpackStatus =
  | { loading: true }
  | ({
      loading: false
    } & CompilerDiagnostics)

interface BuildStatusStore {
  client: WebpackStatus
  server: WebpackStatus
}

enum WebpackStatusPhase {
  COMPILING = 1,
  COMPILED_WITH_ERRORS = 2,
  COMPILED_WITH_WARNINGS = 3,
  COMPILED = 4,
}

function getWebpackStatusPhase(status: WebpackStatus): WebpackStatusPhase {
  if (status.loading === true) {
    return WebpackStatusPhase.COMPILING
  } else if (status.errors) {
    return WebpackStatusPhase.COMPILED_WITH_ERRORS
  } else if (status.warnings) {
    return WebpackStatusPhase.COMPILED_WITH_WARNINGS
  }
  return WebpackStatusPhase.COMPILED
}

const buildStore = createStore<BuildStatusStore>()

buildStore.subscribe(state => {
  const { client, server } = state

  const [{ status }] = [
    { status: client, phase: getWebpackStatusPhase(client) },
    { status: server, phase: getWebpackStatusPhase(server) },
  ].sort((a, b) => a.phase.valueOf() - b.phase.valueOf())

  const { bootstrap: bootstrapping, port } = logStore.getState()
  if (bootstrapping && status.loading) {
    return
  }

  let nextState: LoggerStoreStatus

  if (status.loading === true) {
    nextState = {
      bootstrap: false,
      port,
      loading: true,
    }
  } else {
    let { errors, warnings } = status

    nextState = {
      bootstrap: false,
      port,
      loading: false,
      errors,
      warnings,
    }
  }

  logStore.setState(nextState, true)
})

export function watchCompilers(client: Compiler, server: Compiler) {
  buildStore.setState({
    client: { loading: true },
    server: { loading: true },
  })

  function tapCompiler(
    key: string,
    compiler: Compiler,
    onEvent: (status: WebpackStatus) => void
  ) {
    compiler.hooks.invalid.tap(`BuildInvalid-${key}`, () => {
      onEvent({ loading: true })
    })

    compiler.hooks.done.tap(`BuildDone-${key}`, (stats: any) => {
      const { errors, warnings } = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      })

      const hasErrors = errors && errors.length
      const hasWarnings = warnings && warnings.length

      onEvent({
        loading: false,
        errors: hasErrors ? errors : null,
        warnings: hasWarnings ? warnings : null,
      })
    })
  }

  tapCompiler('client', client, status =>
    buildStore.setState({ client: status })
  )
  tapCompiler('server', server, status =>
    buildStore.setState({ server: status })
  )
}
