import { Compiler } from 'webpack'

export default class ChunkNamesPlugin {
  public apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('ChunkNamesPlugin', compilation => {
      // @ts-ignore
      compilation.chunkTemplate.hooks.renderManifest.intercept({
        register(tapInfo: any) {
          if (tapInfo.name === 'JavascriptModulesPlugin') {
            const originalMethod = tapInfo.fn
            tapInfo.fn = (result: any, options: any) => {
              let filenameTemplate
              const chunk = options.chunk
              const outputOptions = options.outputOptions
              if (chunk.filenameTemplate) {
                filenameTemplate = chunk.filenameTemplate
              } else if (chunk.hasEntryModule()) {
                filenameTemplate = outputOptions.filename
              } else {
                filenameTemplate = outputOptions.chunkFilename
              }

              options.chunk.filenameTemplate = filenameTemplate
              return originalMethod(result, options)
            }
          }
          return tapInfo
        },
      })
    })
  }
}
