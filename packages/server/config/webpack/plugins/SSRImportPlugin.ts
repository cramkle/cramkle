import * as path from 'path'
import { Compiler, Plugin } from 'webpack'

// This plugin exists to fix the relative import for dynamic
// imported modules of code that runs on the server-side
export default class SSRImportPlugin implements Plugin {
  public apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('SSRImportPlugin', (compilation: any) => {
      compilation.mainTemplate.hooks.requireEnsure.tap(
        'SSRImportPlugin',
        (code: string, chunk: any) => {
          // Update to load chunks from our custom chunks directory
          const outputPath = path.resolve('/')
          const pagePath = path.join('/', path.dirname(chunk.name))
          const relativePathToBaseDir = path.relative(pagePath, outputPath)
          // Make sure even in windows, the path looks like in unix
          // Node.js require system will convert it accordingly
          const relativePathToBaseDirNormalized = relativePathToBaseDir.replace(
            /\\/g,
            '/'
          )
          return code
            .replace(
              'require("./"',
              `require("${relativePathToBaseDirNormalized}/"`
            )
            .replace(
              'readFile(join(__dirname',
              `readFile(join(__dirname, "${relativePathToBaseDirNormalized}"`
            )
        }
      )
    })
  }
}
