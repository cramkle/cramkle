import createStore from 'unistore'
import { Compiler } from 'webpack'
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import { NormalizedMessage } from 'fork-ts-checker-webpack-plugin/lib/NormalizedMessage'
import { createCodeframeFormatter } from 'fork-ts-checker-webpack-plugin/lib/formatter/codeframeFormatter'

import { LoggerStoreStatus, logStore } from './logger'

interface CompilerDiagnostics {
  errors: string[] | null
  warnings: string[] | null
}

type WebpackStatus =
  | { loading: true }
  | ({
      loading: false
      typeChecking: boolean
    } & CompilerDiagnostics)

interface BuildStatusStore {
  client: WebpackStatus
  server: WebpackStatus
}

enum WebpackStatusPhase {
  COMPILING = 1,
  COMPILED_WITH_ERRORS = 2,
  TYPE_CHECKING = 3,
  COMPILED_WITH_WARNINGS = 4,
  COMPILED = 5,
}

function getWebpackStatusPhase(status: WebpackStatus): WebpackStatusPhase {
  if (status.loading === true) {
    return WebpackStatusPhase.COMPILING
  } else if (status.errors) {
    return WebpackStatusPhase.COMPILED_WITH_ERRORS
  } else if (status.typeChecking) {
    return WebpackStatusPhase.TYPE_CHECKING
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
    let { errors, warnings, typeChecking } = status

    if (errors == null && typeChecking) {
      nextState = {
        bootstrap: false,
        port,
        typeChecking: true,
        loading: false,
        errors,
        warnings,
      }
    } else {
      nextState = {
        bootstrap: false,
        port,
        loading: false,
        typeChecking: false,
        errors,
        warnings,
      }
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
    enableTypecheck: boolean,
    onEvent: (status: WebpackStatus) => void
  ) {
    let tsMessagesPromise: Promise<CompilerDiagnostics>

    compiler.hooks.invalid.tap(`BuildInvalid-${key}`, () => {
      onEvent({ loading: true })
    })

    if (enableTypecheck) {
      const messageFormatter = createCodeframeFormatter({})
      let resolveMessagesPromise: (diagnostics: CompilerDiagnostics) => void

      const tsCheckerHooks = ForkTsCheckerPlugin.getCompilerHooks(compiler)

      tsCheckerHooks.serviceBeforeStart.tap(`TypecheckStart-${key}`, () => {
        tsMessagesPromise = new Promise(resolve => {
          resolveMessagesPromise = resolve
        })
      })

      tsCheckerHooks.receive.tap(
        `TypecheckReceived-${key}`,
        (diagnostics: NormalizedMessage[], lints: NormalizedMessage[]) => {
          const messages = [...diagnostics, ...lints]
          const format = (msg: NormalizedMessage) => messageFormatter(msg, true)

          const errors = messages
            .filter(msg => msg.severity === 'error')
            .map(format)

          const warnings = messages
            .filter(msg => msg.severity === 'warning')
            .map(format)

          resolveMessagesPromise({
            errors,
            warnings,
          })
        }
      )
    }

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
        typeChecking: enableTypecheck,
      })

      const typePromise = tsMessagesPromise

      if (!hasErrors && typePromise) {
        tsMessagesPromise.then(typeMessages => {
          if (typePromise !== tsMessagesPromise) {
            // this is a promise from a previous build, so we
            // shouldn't care about this
            return
          }

          stats.compilation.errors.push(...(typeMessages.errors || []))
          stats.compilation.warnings.push(...(typeMessages.warnings || []))

          onEvent({
            loading: false,
            typeChecking: false,
            errors: typeMessages.errors,
            warnings: hasWarnings
              ? [...warnings, ...(typeMessages.warnings || [])]
              : typeMessages.warnings,
          })
        })
      }
    })
  }

  tapCompiler('client', client, true, status =>
    buildStore.setState({ client: status })
  )
  tapCompiler('server', server, false, status =>
    buildStore.setState({ server: status })
  )
}
